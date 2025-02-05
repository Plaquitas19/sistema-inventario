import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/db";

// 📌 Endpoint de Login (con bcrypt)
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  console.log(`🔍 Intento de login: ${username}`);

  if (!username || !password) {
    res.status(400).json({ message: "Nombre de usuario y contraseña requeridos" });
    return;
  }

  try {
    // Realizamos la consulta y desestructuramos correctamente
    const [rows] = await db.query<any[]>("SELECT * FROM usuarios WHERE username = ?", [username]);

    if (rows.length === 0) {
      console.log(`❌ Usuario no encontrado: ${username}`);
      res.status(401).json({ message: "Usuario o contraseña incorrectos" });
      return;
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      console.log(`❌ Contraseña incorrecta para usuario: ${username}`);
      res.status(401).json({ message: "Usuario o contraseña incorrectos" });
      return;
    }

    console.log(`✅ Usuario autenticado: ${username}`);
    const token = jwt.sign(
      { usuario_id: user.usuario_id, username: user.username, rol_id: user.rol_id },
      process.env.JWT_SECRET || "secreto_super_seguro",
      { expiresIn: "2h" }
    );

    // 🔹 Enviamos el nombre completo en la respuesta junto con el token
    res.status(200).json({
      token,
      nombre_completo: user.nombre_completo, // Agrega el nombre completo en la respuesta
    });
    

  } catch (error) {
    console.error("🚨 Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

