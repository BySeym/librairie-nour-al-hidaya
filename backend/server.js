import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import carouselRoutes from "./routes/carousel.js";
import promoRoutes from "./routes/promo.js";


const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/promo", promoRoutes);

// 🔐 AUTH
app.use("/api/auth", authRoutes);

// 🎠 CAROUSEL (API)
app.use("/api/carousel", carouselRoutes);

// 🖼️ IMAGES UPLOADÉES
app.use("/uploads", express.static("uploads"));

// 🚀 SERVER
app.listen(3000, () => {
  console.log("Backend lancé sur http://localhost:3000");
});
