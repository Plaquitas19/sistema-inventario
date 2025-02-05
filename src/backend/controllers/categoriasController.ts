import { Request, Response } from "express";
import db from "../models/db";

// Obtener todas las categorías
export const getCategorias = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query<any[]>("SELECT * FROM categorias");
    if (Array.isArray(rows)) {
      res.status(200).json(rows);
    } else {
      res.status(500).json({ message: "Error al obtener categorías" });
    }
  } catch (error) {
    console.error("🚨 Error al obtener categorías:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Registrar una nueva categoría
export const createCategoria = async (req: Request, res: Response): Promise<void> => {
  const { nombre, descripcion } = req.body;
  if (!nombre) {
    res.status(400).json({ message: "El nombre de la categoría es obligatorio" });
    return;
  }
  try {
    const [result] = await db.query<any>(
      "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)",
      [nombre, descripcion]
    );
    if (result && "insertId" in result) {
      res.status(201).json({ message: "Categoría creada exitosamente", categoria_id: result.insertId });
    } else {
      res.status(500).json({ message: "Error al crear la categoría" });
    }
  } catch (error) {
    console.error("🚨 Error al crear la categoría:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Editar una categoría existente
export const updateCategoria = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const [result] = await db.query<any>(
      "UPDATE categorias SET nombre = ?, descripcion = ? WHERE categoria_id = ?",
      [nombre, descripcion, id]
    );
    if (result && "affectedRows" in result && result.affectedRows > 0) {
      res.status(200).json({ message: "Categoría actualizada correctamente" });
    } else {
      res.status(404).json({ message: "Categoría no encontrada" });
    }
  } catch (error) {
    console.error("🚨 Error al actualizar la categoría:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Eliminar una categoría
export const deleteCategoria = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const [result] = await db.query<any>("DELETE FROM categorias WHERE categoria_id = ?", [id]);
    if (result && "affectedRows" in result && result.affectedRows > 0) {
      res.status(200).json({ message: "Categoría eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Categoría no encontrada" });
    }
  } catch (error) {
    console.error("🚨 Error al eliminar la categoría:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
