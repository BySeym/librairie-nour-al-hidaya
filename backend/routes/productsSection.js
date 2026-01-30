import express from "express";
import db from "../db.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import authMiddleware from "../middleware/authMiddleware.js";

// config upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, Date.now() + "." + ext);
  },
});

const upload = multer({ storage });
const router = express.Router();

/* =========================
   GET — public
========================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products_section ORDER BY position ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* =========================
   POST — admin
========================= */
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, position } = req.body;
      const image = req.file.filename;

      await db.query(
        "INSERT INTO products_section (image, title, description, position) VALUES (?, ?, ?, ?)",
        [image, title, description, position]
      );

      res.json({ message: "Carte ajoutée" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

/* =========================
   PUT — admin
========================= */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { image, title, description, position } = req.body;

    await db.query(
      "UPDATE products_section SET image=?, title=?, description=?, position=? WHERE id=?",
      [image, title, description, position, req.params.id]
    );

    res.json({ message: "Carte modifiée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* =========================
   DELETE — admin
========================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT image FROM products_section WHERE id=?",
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Carte introuvable" });
    }

    const image = rows[0].image;
    const imagePath = path.join(process.cwd(), "uploads", image);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await db.query(
      "DELETE FROM products_section WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Carte supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
