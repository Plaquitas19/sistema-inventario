import { Request, Response } from "express";
import db from "../models/db";

// Obtener todos los proveedores
export const getProveedores = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query<any[]>("SELECT * FROM proveedores");
    if (Array.isArray(rows)) {
      res.status(200).json(rows);
    } else {
      res.status(500).json({ message: "Error al obtener proveedores" });
    }
  } catch (error) {
    console.error("🚨 Error al obtener proveedores:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Registrar un nuevo proveedor
export const createProveedor = async (req: Request, res: Response): Promise<void> => {
  const { nombre, contacto, telefono, email, direccion } = req.body;
  if (!nombre) {
    res.status(400).json({ message: "El nombre del proveedor es obligatorio" });
    return;
  }
  try {
    const [result] = await db.query<any>(
      "INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)",
      [nombre, contacto, telefono, email, direccion]
    );
    if (result && "insertId" in result) {
      res.status(201).json({ message: "Proveedor creado exitosamente", proveedor_id: result.insertId });
    } else {
      res.status(500).json({ message: "Error al crear el proveedor" });
    }
  } catch (error) {
    console.error("🚨 Error al crear el proveedor:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Editar un proveedor existente
export const updateProveedor = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nombre, contacto, telefono, email, direccion } = req.body;
  try {
    const [result] = await db.query<any>(
      "UPDATE proveedores SET nombre = ?, contacto = ?, telefono = ?, email = ?, direccion = ? WHERE proveedor_id = ?",
      [nombre, contacto, telefono, email, direccion, id]
    );
    if (result && "affectedRows" in result && result.affectedRows > 0) {
      res.status(200).json({ message: "Proveedor actualizado correctamente" });
    } else {
      res.status(404).json({ message: "Proveedor no encontrado" });
    }
  } catch (error) {
    console.error("🚨 Error al actualizar el proveedor:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Eliminar un proveedor
export const deleteProveedor = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const [result] = await db.query<any>("DELETE FROM proveedores WHERE proveedor_id = ?", [id]);
    if (result && "affectedRows" in result && result.affectedRows > 0) {
      res.status(200).json({ message: "Proveedor eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Proveedor no encontrado" });
    }
  } catch (error) {
    console.error("🚨 Error al eliminar el proveedor:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
