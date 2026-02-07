import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import pool from "@/src/lib/db";
import { ResultSetHeader } from "mysql2";

// 전체 프로젝트 조회 - GET
export async function GET() {
    try {
        const [rows] = await pool.query("select a.id, a.title, a.subTitle, a.updatedAt, GROUP_CONCAT(b.originName) as originNames from project a left join files b on a.id = b.project_id group by a.id;");

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
        // request 로 받은 데이터 파싱 작업
        const data = await req.formData();
        
        const title = data.get("title") as string;
        const subTitle = data.get("subTitle") as string;
        const files = data.getAll("files") as File[];
        const now = new Date();

        // 데이터 유효성 검사(제목, 부제목 파일)
        if(!title || !subTitle || !files) {
            return new Response(
                JSON.stringify({
                    message: "제목과 부제목, 이미지는 필수값입니다."
                }),
                { status: 400 }
            )
        }

        // 게시글 생성
        const [result] = await pool.query(
            "INSERT INTO project (title, subTitle, createdAt, updatedAt) VALUES (?, ?, ?, ?)",
            [title, subTitle, now, now]
        ) as [ResultSetHeader, unknown];

        const projectId = result.insertId;

        // 파일 저장 설정
        const envPath = process.env.FILE_UPLOAD_PATH || "public/uploads";
        const uploadDir = path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath);

        // 저장 경로가 존재하지 않으면 생성
        if(!fs.existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // 다중 파일 처리(물리 저장 + DB 저장)
        const fileUploadResults = await Promise.all(
            files.map(async (file) => {
                const ext = path.extname(file.name);
                const saveName = `${crypto.randomUUID()}${ext}`;
                const buffer = Buffer.from(await file.arrayBuffer());

                // 로컬에 파일 저장
                await writeFile(path.join(uploadDir, saveName), buffer);

                // DB에 파일 저장
                await pool.query(
                    "INSERT INTO files (project_id, originName, saveName, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?)",
                    [projectId, file.name, saveName, now, now]
                );

                return { originName: file.name, saveName};
            })
        );
        return NextResponse.json({
            message: "success",
            projectInfo: {
                id: projectId, 
                title, 
                files: fileUploadResults
            }
        }, {status: 201});
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ message: "fail" }),
            { status : 500}
        )
    }
}