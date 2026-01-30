import dotenv from "dotenv";
dotenv.config();

import mysql from "mysql2/promise";


const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "librairie_nah",
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
});

console.log("✅ MySQL Pool créé");
console.log("🔍 Configuration:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});


pool.getConnection()
  .then(connection => {
    console.log("✅ MySQL connecté avec succès!");
    connection.release();
  })
  .catch(err => {
    console.error("❌ Erreur de connexion MySQL:", err.message);
  });

export default pool;