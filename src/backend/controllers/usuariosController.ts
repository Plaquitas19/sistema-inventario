import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../models/db";

/// 📌 Endpoint para listar usuarios
export const getUsuarios = async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await db.query<any[]>(
        "SELECT usuario_id, username, nombre_completo, email, rol_id, activo, created_at FROM usuarios"
      );
  
      if (Array.isArray(rows)) {
        res.status(200).json(rows);
      } else {
        res.status(500).json({ message: "Error al obtener usuarios" });
      }
    } catch (error) {
      console.error("🚨 Error al obtener usuarios:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  
  // 📌 Registrar un nuevo usuario
  export const registerUser = async (req: Request, res: Response): Promise<void> => {
    console.log("✅ Solicitud recibida en /api/usuarios/register");
    console.log("📩 Datos recibidos:", req.body);
    const { username, password, nombre_completo, email, rol_id } = req.body;
  
    if (!username || !password || !nombre_completo || !email || !rol_id) {
      res.status(400).json({ message: "Todos los campos son obligatorios" });
      return;
    }
  
    try {
      const [existingUsers] = await db.query<any[]>("SELECT username FROM usuarios WHERE username = ? OR email = ?", [username, email]);
      if (existingUsers.length > 0) {
        res.status(400).json({ message: "El usuario o email ya existe" });
        return;
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const [result] = await db.query<any>(
        "INSERT INTO usuarios (username, password_hash, nombre_completo, email, rol_id) VALUES (?, ?, ?, ?, ?)",
        [username, hashedPassword, nombre_completo, email, rol_id]
      );
  
      if (result && "insertId" in result) {
        res.status(201).json({ message: "Usuario registrado exitosamente", usuario_id: result.insertId });
      } else {
        res.status(500).json({ message: "Error al registrar el usuario" });
      }
    } catch (error) {
      console.error("🚨 Error al registrar usuario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  // 📌 Endpoint para editar Usuario
  export const updateUsuario = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { username, nombre_completo, email, rol_id, activo } = req.body;
  
    if (!username || !nombre_completo || !email || !rol_id) {
      res.status(400).json({ message: "Todos los campos son obligatorios" });
      return;
    }
  
    try {
      const [result] = await db.query<any>(
        "UPDATE usuarios SET username = ?, nombre_completo = ?, email = ?, rol_id = ?, activo = ? WHERE usuario_id = ?",
        [username, nombre_completo, email, rol_id, activo, id]
      );
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Usuario actualizado correctamente" });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("🚨 Error al actualizar usuario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  // 📌 Endpoint para eliminar usuario
  
  export const deleteUsuario = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query<any>("DELETE FROM usuarios WHERE usuario_id = ?", [id]);
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Usuario eliminado correctamente" });
      } else {
        res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("🚨 Error al eliminar usuario:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  // Combox - listar roles por nombres en usuario 
  
  export const getRolesNombre = async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await db.query<any[]>("SELECT rol_id, nombre_rol FROM roles");
      
      console.log("Roles obtenidos:", rows);  // Verifica los datos que vienen desde la base de datos
  
      if (Array.isArray(rows) && rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(404).json({ message: "No se encontraron roles" });
      }
    } catch (error) {
      console.error("🚨 Error al obtener roles:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  