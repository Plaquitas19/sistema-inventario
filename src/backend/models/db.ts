import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.error("🚨 ERROR: Faltan variables de entorno en el archivo .env");
  process.exit(1);
}

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection()
  .then(() => console.log("✅ Conexión a MySQL establecida correctamente"))
  .catch((err) => {
    console.error("🚨 ERROR: No se pudo conectar a MySQL:", err);
    process.exit(1);
  });

export default db;
