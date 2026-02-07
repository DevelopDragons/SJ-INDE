import { NextResponse } from 'next/server';
import pool from "@/src/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import path from 'path';
import fs from 'fs';
import { writeFile, unlink } from 'fs/promises';


// 개별 프로젝트 조회 - GET
export async function GET(req: Request, context: { params: Promise<{ id: string }>}) {
    try {
        const {id} = await context.params;
        
        const projectId = Number(id);
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM project where id = ?",
            [projectId]
        );

        if(rows[0] == null) {
            return new Response(
                JSON.stringify({ message: "해당 프로젝트는 존재 하지 않습니다." }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify(rows[0]),
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

// 개별 프로젝트 수정 - UPDATE
export async function PUT(req: Request, context: { params: Promise<{ id: string }>}) {
    try {
        const {id} = await context.params;
        const projectId = Number(id);

        const data = await req.formData();

        const title = data.get("title") as string;
        const subTitle = data.get("subTitle") as string;
        const files = data.getAll("files") as File[];
        const now = new Date();

        if(!title || !subTitle) {
            return new Response(
                JSON.stringify({
                    message: "제목과 부제목은 필수값입니다."
                }),
                { status: 400 }
            )
        }

        const [result] = await pool.query(
            "UPDATE project SET title = ?, subTitle = ?, updatedAt = ? WHERE id = ?",
            [title, subTitle, now, projectId]
        ) as [ResultSetHeader, unknown];

        if(result.affectedRows === 0) {
            return Response.json(
                { message: "수정할 데이터가 없습니다."},
                { status: 404}
            );
        }

        const [oldFiles] = await pool.query<RowDataPacket[]>(
            "SELECT saveName FROM files WHERE project_id = ?",
            [projectId]
        );

        const envPath = process.env.FILE_UPLOAD_PATH || "public/uploads";
        const uploadDir = path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath);

        await Promise.all(
            oldFiles.map(async (file) => {
                const filePath = path.join(uploadDir, file.saveName);
                if(fs.existsSync(filePath)) {
                    await unlink(filePath);
                }
            })
        );

        await pool.query("DELETE FROM files WHERE project_id = ?", [projectId]);

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
        }, { status: 201});

        return new Response(
            JSON.stringify({
                message: "프로젝트 수정 성공"
            }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err);

        return new Response(
            JSON.stringify({ message: "프로젝트 수정 실패"}),
            { status: 500 }
        );
    }
}

// 개별 프로젝트 삭제 - DELETE
export async function DELETE(req: Request, context: { params: Promise<{ id: string }>}) {
    try {
        const {id} = await context.params;
        const projectId = Number(id);

        const [oldFiles] = await pool.query<RowDataPacket[]>(
            "SELECT saveName FROM files WHERE project_id",
            [projectId]
        );

        const envPath = process.env.FILE_UPLOAD_PATH || "public/uploads";
        const uploadDir = path.isAbsolute(envPath) ? envPath : path.join(process.cwd(), envPath);

        await Promise.all(
            oldFiles.map(async (file) => {
                const filePath = path.join(uploadDir, file.saveName);
                if(fs.existsSync(filePath)) {
                    await unlink(filePath);
                }
            })
        );

        await pool.query("DELETE FROM files WHERE project_id = ?", [projectId]);

        const [result] = await pool.query(
            "DELETE FROM project WHERE id = ?",
            [projectId]
        ) as [ResultSetHeader, unknown];

        if(result.affectedRows === 0) {
            return Response.json(
                { message: "삭제할 데이터가 없습니다." },
                { status: 401}
            );
        }

        return new Response(
            null,
            { status: 204 }
        )
    } catch (err) {
        console.error(err);

        return new Response(
            JSON.stringify({ message: "프로젝트 삭제 실패"}),
            { status: 500 }
        );
    }
}