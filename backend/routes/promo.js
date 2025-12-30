import express from "express";
import db from "../db.js";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import path from "path";
import fs from "fs";


const router = express.Router();

// upload image
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, "promo." + ext);
  }
});
const upload = multer({ storage });

/* =====================
   GET promo (public)
===================== */
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM promo LIMIT 1");
  res.json(rows[0]);
});

/* =====================
   UPDATE promo (admin)
===================== */
// router.put("/", authMiddleware, upload.single("image"), async (req, res) => {
//   const { badge, title, description } = req.body;

//   let query = "UPDATE promo SET badge=?, title=?, description=?";
//   let params = [badge, title, description];

//   if (req.file) {
//     query += ", image=?";
//     params.push(req.file.filename);
//   }

//   await db.query(query, params);

//   res.json({ message: "Promo mise à jour" });
// });

router.put(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { badge, title, description } = req.body;

      // 1️⃣ récupérer l’ancienne image
      const [rows] = await db.query(
        "SELECT image FROM promo WHERE id = 1"
      );

      const oldImage = rows[0]?.image;

      // 2️⃣ nouvelle image si envoyée
      const newImage = req.file ? req.file.filename : oldImage;

      // 3️⃣ supprimer l’ancienne image si nouvelle fournie
      if (req.file && oldImage) {
        const oldPath = path.join(process.cwd(), "uploads", oldImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // 4️⃣ mise à jour DB
      await db.query(
        `UPDATE promo
         SET badge = ?, title = ?, description = ?, image = ?
         WHERE id = 1`,
        [badge, title, description, newImage]
      );

      res.json({ message: "Promo mise à jour" });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);


export default router;
