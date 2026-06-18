// MySQL 활용

// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: Number(process.env.DB_PORT),
// });

// // MySQL 연결
// (async () => {
//     try {
//         const connection = await pool.getConnection();
//         console.log("MySQL 연결 성공");
//         connection.release();
//     } catch (err) {
//         console.error("MySQL 연결 실패: ", err);
//     }
// })();

// export default pool;

import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false //
    }
});

export default pool;