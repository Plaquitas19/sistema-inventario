const bcrypt = require("bcryptjs");

async function generateHash() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  console.log("Contraseña hasheada:", hashedPassword);
}

generateHash();
