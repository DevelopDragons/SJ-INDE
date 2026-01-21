import pool from "@/src/lib/db";

export async function GET(request: Request) {
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