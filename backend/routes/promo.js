

// import express from "express";
// import db from "../db.js";
// import multer from "multer";
// import authMiddleware from "../middleware/authMiddleware.js";
// import path from "path";
// import fs from "fs";

// const router = express.Router();

// // ✅ Configuration multer avec noms uniques
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     const ext = file.originalname.split(".").pop();
//     // Génère un nom unique avec timestamp
//     const uniqueName = `promo-${Date.now()}.${ext}`;
//     cb(null, uniqueName);
//   }
// });

// const upload = multer({ storage });

// /* =====================
//    GET promo (public)
// ===================== */
// router.get("/", async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM promo LIMIT 1");
    
//     if (!rows || rows.length === 0) {
//       return res.status(404).json({ message: "Aucune promo trouvée" });
//     }
    
//     res.json(rows[0]);
//   } catch (err) {
//     console.error("❌ Erreur GET promo:", err);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// });

// /* =====================
//    UPDATE promo (admin)
// ===================== */
// router.put(
//   "/",
//   authMiddleware,
//   upload.single("image"),
//   async (req, res) => {
//     try {
//       const { badge, title, description } = req.body;

//       console.log("📝 Mise à jour promo:", { badge, title, description });
//       console.log("📸 Fichier uploadé:", req.file?.filename);

//       // 1️⃣ Récupérer l'ancienne image
//       const [rows] = await db.query(
//         "SELECT image FROM promo WHERE id = 1"
//       );

//       const oldImage = rows[0]?.image;

//       // 2️⃣ Déterminer la nouvelle image
//       const newImage = req.file ? req.file.filename : oldImage;

//       // 3️⃣ Supprimer l'ancienne image si une nouvelle est fournie
//       if (req.file && oldImage && oldImage !== newImage) {
//         const oldPath = path.join(process.cwd(), "uploads", oldImage);
        
//         if (fs.existsSync(oldPath)) {
//           try {
//             fs.unlinkSync(oldPath);
//             console.log("🗑️ Ancienne image supprimée:", oldImage);
//           } catch (deleteErr) {
//             console.error("⚠️ Impossible de supprimer l'ancienne image:", deleteErr);
//           }
//         } else {
//           console.log("⚠️ Ancienne image introuvable:", oldPath);
//         }
//       }

//       // 4️⃣ Mise à jour de la base de données
//       await db.query(
//         `UPDATE promo
//          SET badge = ?, title = ?, description = ?, image = ?
//          WHERE id = 1`,
//         [badge, title, description, newImage]
//       );

//       console.log("✅ Promo mise à jour avec succès");
//       console.log("🖼️ Nouvelle image:", newImage);

//       res.json({ 
//         message: "Promo mise à jour",
//         image: newImage,
//         timestamp: Date.now() // Pour le cache busting côté client
//       });

//     } catch (err) {
//       console.error("❌ Erreur UPDATE promo:", err);
//       res.status(500).json({ message: "Erreur serveur" });
//     }
//   }
// );

// export default router;


import express from "express";
import db from "../db.js";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import cloudinary from "../cloudinary.js";

const router = express.Router();

// ✅ Multer en mémoire (PAS de disque)
const upload = multer({ storage: multer.memoryStorage() });

/* =====================
   GET promo (public)
===================== */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM promo LIMIT 1");

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Aucune promo trouvée" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Erreur GET promo:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* =====================
   UPDATE promo (admin)
===================== */
router.put(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { badge, title, description } = req.body;

      let imageUrl = null;

      // 🔹 Upload Cloudinary si nouvelle image
      if (req.file) {
        const result = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
          {
            folder: "nour-al-hidaya/promo",
          }
        );

        imageUrl = result.secure_url;
      }

      // 🔹 Si pas de nouvelle image, on garde l’existante
      if (!imageUrl) {
        const [rows] = await db.query(
          "SELECT image FROM promo WHERE id = 1"
        );
        imageUrl = rows[0]?.image || null;
      }

      // 🔹 Mise à jour DB
      await db.query(
        `UPDATE promo
         SET badge = ?, title = ?, description = ?, image = ?
         WHERE id = 1`,
        [badge, title, description, imageUrl]
      );

      res.json({
        message: "Promo mise à jour",
        image: imageUrl,
      });

    } catch (err) {
      console.error("❌ Erreur UPDATE promo :", err);

      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

export default router;

