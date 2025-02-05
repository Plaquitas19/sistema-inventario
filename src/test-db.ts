import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log("✅ Conexión exitosa a la base de datos MySQL");
        await connection.end();
    } catch (error) {
        console.error("🚨 ERROR: No se pudo conectar a MySQL:", error);
    }
})();
