import { Request, Response } from "express";
import db from "../models/db";

// Obtener todos los roles
export const getRoles = async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await db.query<any[]>("SELECT * FROM roles");
  
      // Aseguramos que `rows` es un arreglo
      if (Array.isArray(rows)) {
        res.status(200).json(rows);
      } else {
        res.status(500).json({ message: "Error al obtener roles" });
      }
    } catch (error) {
      console.error("🚨 Error al obtener roles:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  // Registrar un nuevo rol
  export const createRole = async (req: Request, res: Response): Promise<void> => {
    const { nombre_rol, descripcion } = req.body;
  
    if (!nombre_rol) {
      res.status(400).json({ message: "El nombre del rol es obligatorio" });
      return;
    }
  
    try {
      const [result] = await db.query<any>("INSERT INTO roles (nombre_rol, descripcion) VALUES (?, ?)", [
        nombre_rol,
        descripcion,
      ]);
  
      // Comprobamos si `result` tiene la propiedad `insertId` que indica que se insertó un nuevo registro
      if (result && "insertId" in result) {
        res.status(201).json({ message: "Rol creado exitosamente", rol_id: result.insertId });
      } else {
        res.status(500).json({ message: "Error al crear el rol" });
      }
    } catch (error) {
      console.error("🚨 Error al crear el rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  // Editar un rol
  export const updateRole = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nombre_rol, descripcion } = req.body;
  
    try {
      const [result] = await db.query<any>(
        "UPDATE roles SET nombre_rol = ?, descripcion = ? WHERE rol_id = ?",
        [nombre_rol, descripcion, id]
      );
  
      if (result && "affectedRows" in result && result.affectedRows > 0) {
        res.status(200).json({ message: "Rol actualizado correctamente" });
      } else {
        res.status(404).json({ message: "Rol no encontrado" });
      }
    } catch (error) {
      console.error("🚨 Error al actualizar el rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  