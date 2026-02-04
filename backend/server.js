import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import carouselRoutes from "./routes/carousel.js";
import promoRoutes from "./routes/promo.js";
import productsSectionRoutes from "./routes/productsSection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());


const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Dossier uploads créé");
} else {
  console.log("✅ Dossier uploads existant");
}

app.use("/uploads", (req, res, next) => {

  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });
  next();
});

app.use("/uploads", express.static(uploadsDir));

// 🔐 AUTH
app.use("/api/auth", authRoutes);

// 🎠 CAROUSEL (API)
app.use("/api/carousel", carouselRoutes);

// 🎯 PROMO (API)
app.use("/api/promo", promoRoutes);

// 🚀 SERVER
const PORT = process.env.PORT || 3000;

// 🧥 Product
app.use("/api/products-section", productsSectionRoutes);


app.listen(PORT, () => {
  console.log(`Backend lancé sur http://localhost:${PORT}`);
  console.log(`📁 Uploads disponibles sur http://localhost:${PORT}/uploads/`);
});