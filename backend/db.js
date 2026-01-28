import mysql from "mysql2/promise";

// ✅ UTILISER UN POOL au lieu d'une connexion unique
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "19the79Wall.*",
  database: "librairie_nah",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("✅ MySQL Pool créé");

// Test de connexion au démarrage
try {
  const connection = await pool.getConnection();
  console.log("✅ MySQL connecté avec succès");
  connection.release();
} catch (err) {
  console.error("❌ Erreur de connexion MySQL:", err);
}

export default pool;