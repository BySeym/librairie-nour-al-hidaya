import bcrypt from "bcrypt";

const password = "19The79Wall"; 

const hash = await bcrypt.hash(password, 10);
console.log(hash);


