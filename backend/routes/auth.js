import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

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
    "SECRET_TEMPORAIRE",
    { expiresIn: "2h" }
  );

  res.json({ token });
});

export default router;
