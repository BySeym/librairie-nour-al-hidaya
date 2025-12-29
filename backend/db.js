import mysql from "mysql2/promise";

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "librairie_nah" // ⚠️ le bon nom
});

console.log("MySQL connecté");

export default db;
