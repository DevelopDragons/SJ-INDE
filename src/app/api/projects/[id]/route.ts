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
        
        // 파일 정보까지 같이 가져오기 위해 JOIN 쿼리 권장 (상세페이지용)
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

        // 1. 프로젝트 기본 정보 업데이트
        const [result] = await pool.query(
            "UPDATE project SET title = ?, subTitle = ?, updatedAt = ? WHERE id = ?",
            [title, subTitle, now, projectId]
        ) as [ResultSetHeader, unknown];

        if (result.affectedRows === 0) {
            return NextResponse.json({ message: "수정할 데이터를 찾을 수 없습니다." }, { status: 404 });
        }

        // 2. 새로운 파일이 업로드된 경우에만 기존 파일 삭제 및 교체 로직 실행
        if (files && files.length > 0 && files[0] instanceof File) {
            const uploadDir = getUploadDir();

            // 기존 파일 정보 조회 및 물리적 삭제
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

            // DB에서 기존 파일 기록 삭제
            await pool.query("DELETE FROM files WHERE project_id = ?", [projectId]);

            // 새로운 파일 저장
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

        // 1. 연관된 파일들 먼저 조회
        const [oldFiles] = await pool.query<RowDataPacket[]>(
            "SELECT saveName FROM files WHERE project_id = ?",
            [projectId]
        );

        // 2. 물리적 파일 삭제
        await Promise.all(
            oldFiles.map(async (file) => {
                const filePath = path.join(uploadDir, file.saveName);
                if (fs.existsSync(filePath)) await unlink(filePath);
            })
        );

        // 3. DB 데이터 삭제 (파일 테이블 -> 프로젝트 테이블 순서)
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