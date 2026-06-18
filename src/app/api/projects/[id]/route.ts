import { NextResponse } from 'next/server';
import pool from "@/src/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import path from 'path';
import fs from 'fs';
import { writeFile, unlink, mkdir } from 'fs/promises';

// 공통 경로 설정: 프로젝트 루트의 public/uploads
const getUploadDir = () => path.join(process.cwd(), "public", "uploads");

// 개별 프로젝트 조회 - GET
export async function GET(req: Request, context: { params: Promise<{ id: string }>}) {
    try {
        const { id } = await context.params;
        const projectId = Number(id);
        
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT a.*, GROUP_CONCAT(b.saveName) as saveNames 
             FROM project a 
             LEFT JOIN files b ON a.id = b.project_id 
             WHERE a.id = ? 
             GROUP BY a.id`,
            [projectId]
        );

        if (!rows[0]) {
            return NextResponse.json({ message: "해당 프로젝트는 존재하지 않습니다." }, { status: 404 });
        }

        return NextResponse.json(rows[0], { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "DB 조회 실패" }, { status: 500 });
    }
}

// 개별 프로젝트 수정 - PUT
export async function PUT(req: Request, context: { params: Promise<{ id: string }>}) {
    try {
        const { id } = await context.params;
        const projectId = Number(id);
        const data = await req.formData();

        const title = data.get("title") as string;
        const subTitle = data.get("subTitle") as string;
        const files = data.getAll("files") as File[];
        const now = new Date();

        if (!title || !subTitle) {
            return NextResponse.json({ message: "제목과 부제목은 필수값입니다." }, { status: 400 });
        }

        const [result] = await pool.query(
            "UPDATE project SET title = ?, subTitle = ?, updatedAt = ? WHERE id = ?",
            [title, subTitle, now, projectId]
        ) as [ResultSetHeader, unknown];

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "수정할 데이터를 찾을 수 없습니다." }, { status: 404 });
        }

        if (files && files.length > 0 && files[0] instanceof File) {
            const uploadDir = getUploadDir();

            const [oldFiles] = await pool.query<RowDataPacket[]>(
                "SELECT saveName FROM files WHERE project_id = ?",
                [projectId]
            );

            await Promise.all(
                oldFiles.map(async (file) => {
                    const filePath = path.join(uploadDir, file.saveName);
                    if (fs.existsSync(filePath)) await unlink(filePath);
                })
            );

            await pool.query("DELETE FROM files WHERE project_id = ?", [projectId]);

            if (!fs.existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });

            const fileUploadResults = await Promise.all(
                files.map(async (file) => {
                    const ext = path.extname(file.name);
                    const saveName = `${crypto.randomUUID()}${ext}`;
                    const buffer = Buffer.from(await file.arrayBuffer());

                    await writeFile(path.join(uploadDir, saveName), buffer);

                    await pool.query(
                        "INSERT INTO files (project_id, originName, saveName, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?)",
                        [projectId, file.name, saveName, now, now]
                    );

                    return { originName: file.name, saveName };
                })
            );
            
            return NextResponse.json({ message: "수정 성공", files: fileUploadResults }, { status: 200 });
        }

        return NextResponse.json({ message: "텍스트 정보 수정 성공" }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "프로젝트 수정 실패" }, { status: 500 });
    }
}

// 개별 프로젝트 삭제 - DELETE
export async function DELETE(req: Request, context: { params: Promise<{ id: string }>}) {
    try {
        const { id } = await context.params;
        const projectId = Number(id);
        const uploadDir = getUploadDir();

        const [oldFiles] = await pool.query<RowDataPacket[]>(
            "SELECT saveName FROM files WHERE project_id = ?",
            [projectId]
        );

        await Promise.all(
            oldFiles.map(async (file) => {
                const filePath = path.join(uploadDir, file.saveName);
                if (fs.existsSync(filePath)) await unlink(filePath);
            })
        );

        await pool.query("DELETE FROM files WHERE project_id = ?", [projectId]);
        const [result] = await pool.query(
            "DELETE FROM project WHERE id = ?",
            [projectId]
        ) as [ResultSetHeader, unknown];

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "삭제할 데이터가 없습니다." }, { status: 404 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "프로젝트 삭제 실패" }, { status: 500 });
    }
}

// 📌 app/api/projects/[id]/route.ts 파일 하단의 PATCH 함수를 이 코드로 교체하세요.

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // context 대신 직접 구조 분해
) {
  try {
    // 1. 비동기 파라미터 처리 완료 후 id 추출
    const resolvedParams = await params;
    const projectId = Number(resolvedParams.id);
    const now = new Date();

    if (isNaN(projectId)) {
      return NextResponse.json({ message: "올바르지 않은 프로젝트 ID입니다." }, { status: 400 });
    }

    // 2. 프론트엔드가 body에 실어 보낸 { uploadCheck: nextStatus } 값 읽어오기
    const body = await req.json();
    const { uploadCheck } = body;

    // 3. 값 유효성 검증 (0 또는 1이 아닌 잘못된 값이 들어오면 차단)
    if (uploadCheck !== 0 && uploadCheck !== 1) {
      return NextResponse.json({ message: "잘못된 상태 값입니다." }, { status: 400 });
    }

    // 4. DB에 프론트엔드가 요청한 새로운 상태값 바로 업데이트
    const [result] = await pool.query(
      "UPDATE project SET uploadCheck = ?, updatedAt = ? WHERE id = ?",
      [uploadCheck, now, projectId]
    ) as [ResultSetHeader, unknown];

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "해당 프로젝트를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "노출 상태가 성공적으로 변경되었습니다.", 
      uploadCheck: uploadCheck 
    }, { status: 200 });

  } catch (err) {
    console.error("노출 토글 에러:", err);
    return NextResponse.json({ message: "노출 상태 변경 실패" }, { status: 500 });
  }
}