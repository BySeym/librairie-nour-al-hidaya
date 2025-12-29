import express from "express";
import  db  from "../db.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import authMiddleware from "../middleware/authMiddleware.js";


// config upload
const storage = multer.diskStorage({
  destination: "uploads/",
filename: (req, file, cb) => {
  const ext = file.originalname.split('.').pop();
  cb(null, Date.now() + "." + ext);
}

});

const upload = multer({ storage });


const router = express.Router();

/* =========================
   GET — lire les slides
========================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM carousel ORDER BY position ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* =========================
   POST — ajouter une slide
========================= */
// router.post("/", async (req, res) => {
//   try {
//     const { image, title, description, position } = req.body;

//     await db.query(
//       "INSERT INTO carousel (image, title, description, position) VALUES (?, ?, ?, ?)",
//       [image, title, description, position]
//     );

//     res.json({ message: "Slide ajoutée" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// });

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {

  try {
    const { title, description, position } = req.body;
    const image = req.file.filename;

    await db.query(
      "INSERT INTO carousel (image, title, description, position) VALUES (?, ?, ?, ?)",
      [image, title, description, position]
    );

    res.json({ message: "Slide ajoutée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


/* =========================
   PUT — modifier une slide
========================= */
router.put("/:id", async (req, res) => {
  try {
    const { image, title, description, position } = req.body;

    await db.query(
      "UPDATE carousel SET image=?, title=?, description=?, position=? WHERE id=?",
      [image, title, description, position, req.params.id]
    );

    res.json({ message: "Slide modifiée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* =========================
   DELETE — supprimer
========================= */
// router.delete("/:id", async (req, res) => {
//   try {
//     await db.query(
//       "DELETE FROM carousel WHERE id=?",
//       [req.params.id]
//     );

//     res.json({ message: "Slide supprimée" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// });


// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     // 1) Récupérer le nom de l'image
//     const [rows] = await db.query(
//       "SELECT image FROM carousel WHERE id=?",
//       [req.params.id]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Slide introuvable" });
//     }

//     const image = rows[0].image;

//     // 2) Supprimer le fichier image s'il existe
//     const imagePath = path.join("uploads", image);

//     if (fs.existsSync(imagePath)) {
//       fs.unlinkSync(imagePath);
//     }

//     // 3) Supprimer la slide en DB
//     await db.query(
//       "DELETE FROM carousel WHERE id=?",
//       [req.params.id]
//     );

//     res.json({ message: "Slide et image supprimées" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// });


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // 1️⃣ récupérer l’image
    const [rows] = await db.query(
      "SELECT image FROM carousel WHERE id=?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Slide introuvable" });
    }

    const image = rows[0].image;

    // 2️⃣ supprimer le fichier image
    const imagePath = path.join(process.cwd(), "uploads", image);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // 3️⃣ supprimer en base
    await db.query(
      "DELETE FROM carousel WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Slide et image supprimées" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


export default router;
