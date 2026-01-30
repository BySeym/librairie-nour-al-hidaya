import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

// Route de login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM admins WHERE username = ?",
    [username]
  );

  if (!rows.length) {
    return res.status(401).json({ message: "Accès refusé" });
  }

  const admin = rows[0];
  const valid = await bcrypt.compare(password, admin.password);

  if (!valid) {
    return res.status(401).json({ message: "Accès refusé" });
  }

  const token = jwt.sign(
    { id: admin.id },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token });
});

// Route pour vérifier si le token est valide
router.get("/verify", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false, message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, adminId: decoded.id });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ valid: false, message: "Token expiré" });
    }
    return res.status(401).json({ valid: false, message: "Token invalide" });
  }
});

export default router;