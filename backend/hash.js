import bcrypt from "bcrypt";

const password = "*admin123*"; // ← mot de passe de ton choix

const hash = await bcrypt.hash(password, 10);
console.log(hash);
