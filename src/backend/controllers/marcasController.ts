import { Request, Response } from "express";
import db from "../models/db";


// 📌 Obtener todas las marcas
export const getMarcas = async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await db.query<any[]>("SELECT * FROM marcas");
      
      if (Array.isArray(rows)) {
        res.status(200).json(rows);
      } else {
        res.status(500).json({ message: "Error al obtener marcas" });
      }
    } catch (error) {
      console.error("🚨 Error al obtener marcas:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  // 📌 Registrar una nueva marca y devolver la lista actualizada
  export const createMarca = async (req: Request, res: Response): Promise<void> => {
    const { nombre, pais_origen } = req.body;
  
    if (!nombre) {
      res.status(400).json({ message: "El nombre de la marca es obligatorio" });
      return;
    }
  
    try {
      const [result] = await db.query<any>("INSERT INTO marcas (nombre, pais_origen) VALUES (?, ?)", [
        nombre,
        pais_origen,
      ]);
  
      if (result && "insertId" in result) {
        // Obtener la lista actualizada de marcas
        const [updatedRows] = await db.query<any[]>("SELECT * FROM marcas");
        res.status(201).json({ message: "Marca creada exitosamente", marca_id: result.insertId, marcas: updatedRows });
      } else {
        res.status(500).json({ message: "Error al crear la marca" });
      }
    } catch (error) {
      console.error("🚨 Error al crear la marca:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  // 📌 Editar una marca
  export const updateMarca = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nombre, pais_origen } = req.body;
  
    if (!nombre) {
      res.status(400).json({ message: "El nombre de la marca es obligatorio" });
      return;
    }
  
    try {
      const [result] = await db.query<any>(
        "UPDATE marcas SET nombre = ?, pais_origen = ? WHERE marca_id = ?",
        [nombre, pais_origen, id]
      );
  
      if (result && "affectedRows" in result && result.affectedRows > 0) {
        // Obtener la lista actualizada de marcas
        const [updatedRows] = await db.query<any[]>("SELECT * FROM marcas");
        res.status(200).json({ message: "Marca actualizada correctamente", marcas: updatedRows });
      } else {
        res.status(404).json({ message: "Marca no encontrada" });
      }
    } catch (error) {
      console.error("🚨 Error al actualizar la marca:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  // 📌 Eliminar una marca
  export const deleteMarca = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      const [result] = await db.query<any>("DELETE FROM marcas WHERE marca_id = ?", [id]);
  
      if (result && "affectedRows" in result && result.affectedRows > 0) {
        // Obtener la lista actualizada de marcas
        const [updatedRows] = await db.query<any[]>("SELECT * FROM marcas");
        res.status(200).json({ message: "Marca eliminada correctamente", marcas: updatedRows });
      } else {
        res.status(404).json({ message: "Marca no encontrada" });
      }
    } catch (error) {
      console.error("🚨 Error al eliminar la marca:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  