import pool from "@/src/lib/db";
import { ResultSetHeader } from "mysql2";

// 전체 프로젝트 조회 - GET
export async function GET() {
    try {
        const [rows] = await pool.query('SELECT * FROM project');

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
            "INSERT INTO project (title, subTitle, createdAt, updatedAt) VALUES (?, ?, ?, ?)",
            [title, subTitle, now, now]
        ) as [ResultSetHeader, unknown];

        return new Response(
            JSON.stringify({
                message: "success",
                projectInfo: {
                    id: result.insertId,
                }
            }),
            { status : 201 }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ message: "fail" }),
            { status : 500}
        )
    }
}