import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import pool from "@/src/lib/db";
import { ResultSetHeader } from "mysql2";

// 전체 프로젝트 조회 - GET
export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT 
                a.id, a.title, a.subTitle, a.updatedAt, 
                GROUP_CONCAT(b.saveName) as saveNames 
            FROM project a 
            LEFT JOIN files b ON a.id = b.project_id 
            GROUP BY a.id;
        `);

        return new Response(
            JSON.stringify(rows),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (err) {
        console.error(err);

        return new Response(
            JSON.stringify({ message: "DB 조회 실패" }),
            { status: 500 }
        );
    }
}

// 프로젝트 업로드 - POST
export async function POST(req: Request) {
    try {
        const data = await req.formData();
        
        const title = data.get("title") as string;
        const subTitle = data.get("subTitle") as string;
        const files = data.getAll("files") as File[];
        const now = new Date();

        if(!title || !subTitle || !files || files.length === 0) {
            return NextResponse.json({
                message: "제목과 부제목, 이미지는 필수값입니다."
            }, { status: 400 });
        }

        // 1. 저장 경로를 프로젝트 루트의 public/uploads로 고정
        // process.cwd()는 프로젝트의 최상위 루트를 가리킵니다.
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // 2. 폴더가 없으면 생성 (recursive 옵션으로 하위까지 생성)
        if(!fs.existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // 3. 프로젝트(게시글) DB 생성
        const [result] = await pool.query(
            "INSERT INTO project (title, subTitle, createdAt, updatedAt) VALUES (?, ?, ?, ?)",
            [title, subTitle, now, now]
        ) as [ResultSetHeader, unknown];

        const projectId = result.insertId;

        // 4. 다중 파일 처리 (물리적 저장 + 파일 DB 저장)
        const fileUploadResults = await Promise.all(
            files.map(async (file) => {
                const ext = path.extname(file.name);
                const saveName = `${crypto.randomUUID()}${ext}`; // 유니크한 파일명 생성
                const buffer = Buffer.from(await file.arrayBuffer());

                // 실제 물리적 저장 위치: public/uploads/uuid.ext
                const filePath = path.join(uploadDir, saveName);
                await writeFile(filePath, buffer);

                // DB에는 나중에 접근하기 쉽도록 saveName을 저장
                await pool.query(
                    "INSERT INTO files (project_id, originName, saveName, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?)",
                    [projectId, file.name, saveName, now, now]
                );

                return { originName: file.name, saveName };
            })
        );

        return NextResponse.json({
            message: "success",
            projectInfo: {
                id: projectId, 
                title, 
                files: fileUploadResults
            }
        }, { status: 201 });

    } catch (err) {
        console.error("Upload Error:", err);
        return NextResponse.json({ message: "서버 에러가 발생했습니다." }, { status: 500 });
    }
}