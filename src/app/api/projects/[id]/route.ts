import pool from "@/src/lib/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// 개별 프로젝트 조회 - GET
export async function GET(req: Request, context: { params: Promise<{ id: string }>}) {
    try {
        const {id} = await context.params;
        
        const projectId = Number(id);
        const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM project where id = ?",
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