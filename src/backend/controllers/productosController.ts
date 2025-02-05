import { Request, Response } from "express";
import db from "../models/db";

// 📌 Obtener todos los productos con nombres de categoría, marca y proveedor
export const getProductos = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query<any[]>(`
      SELECT 
        p.producto_id, p.sku, p.nombre, p.descripcion, 
        IFNULL(c.nombre, 'Sin Categoría') AS categoria, 
        IFNULL(m.nombre, 'Sin Marca') AS marca, 
        IFNULL(pr.nombre, 'Sin Proveedor') AS proveedor,
        p.precio_compra, p.precio_venta, p.stock_minimo, p.stock_actual, 
        p.ubicacion, p.categoria_id, p.marca_id, p.proveedor_id
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.categoria_id
      LEFT JOIN marcas m ON p.marca_id = m.marca_id
      LEFT JOIN proveedores pr ON p.proveedor_id = pr.proveedor_id
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("🚨 Error al obtener productos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 📌 Registrar un nuevo producto
export const createProducto = async (req: Request, res: Response): Promise<void> => {
  const {
    sku, nombre, descripcion, categoria_id, marca_id, proveedor_id,
    precio_compra, precio_venta, stock_minimo, stock_actual, ubicacion
  } = req.body;

  console.log("📌 Datos recibidos en el backend (Crear Producto):", req.body);

  if (!sku || !nombre || !categoria_id || !marca_id || !proveedor_id) {
    res.status(400).json({ message: "Todos los campos obligatorios deben ser completados" });
    return;
  }

  try {
    const [result] = await db.query<any>(
      "INSERT INTO productos (sku, nombre, descripcion, categoria_id, marca_id, proveedor_id, precio_compra, precio_venta, stock_minimo, stock_actual, ubicacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [sku, nombre, descripcion, categoria_id, marca_id, proveedor_id, precio_compra, precio_venta, stock_minimo, stock_actual, ubicacion]
    );

    res.status(201).json({ message: "Producto registrado exitosamente", producto_id: result.insertId });
  } catch (error) {
    console.error("🚨 Error al registrar producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 📌 Actualizar un producto
export const updateProducto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    sku, nombre, descripcion, categoria_id, marca_id, proveedor_id,
    precio_compra, precio_venta, stock_minimo, stock_actual, ubicacion
  } = req.body;

  console.log("📌 Datos recibidos en el backend (Actualizar Producto):", req.body);
  console.log("📌 ID recibido para actualizar:", id);

  // Asegurar que `id` sea un número válido
  const safeId = Number(id);
  if (isNaN(safeId)) {
    console.error("🚨 Error: ID de producto inválido.");
    res.status(400).json({ message: "ID de producto inválido" });
    return;
  }

  // Convertir valores a `number` asegurando que no sean `null` o `undefined`
  const safeCategoriaId = categoria_id !== "" && categoria_id !== null ? Number(categoria_id) : null;
  const safeMarcaId = marca_id !== "" && marca_id !== null ? Number(marca_id) : null;
  const safeProveedorId = proveedor_id !== "" && proveedor_id !== null ? Number(proveedor_id) : null;
  const safePrecioCompra = precio_compra !== "" && precio_compra !== null ? Number(precio_compra) : 0;
  const safePrecioVenta = precio_venta !== "" && precio_venta !== null ? Number(precio_venta) : 0;
  const safeStockMinimo = stock_minimo !== "" && stock_minimo !== null ? Number(stock_minimo) : 0;
  const safeStockActual = stock_actual !== "" && stock_actual !== null ? Number(stock_actual) : 0;

  console.log("📌 Datos procesados para actualizar:", {
    sku, nombre, descripcion, safeCategoriaId, safeMarcaId, safeProveedorId,
    safePrecioCompra, safePrecioVenta, safeStockMinimo, safeStockActual, ubicacion
  });

  // Validar que los campos esenciales no estén vacíos
  if (!sku || !nombre) {
    console.error("🚨 Error: SKU y Nombre son obligatorios.");
    res.status(400).json({ message: "El SKU y el Nombre son obligatorios" });
    return;
  }

  try {
    const [result] = await db.query<any>(
      `UPDATE productos 
       SET sku = ?, nombre = ?, descripcion = ?, categoria_id = ?, marca_id = ?, proveedor_id = ?, 
           precio_compra = ?, precio_venta = ?, stock_minimo = ?, stock_actual = ?, ubicacion = ? 
       WHERE producto_id = ?`,
      [sku, nombre, descripcion, safeCategoriaId, safeMarcaId, safeProveedorId,
       safePrecioCompra, safePrecioVenta, safeStockMinimo, safeStockActual, ubicacion, safeId]
    );

    if (result.affectedRows > 0) {
      console.log("✅ Producto actualizado correctamente.");
      res.status(200).json({ message: "Producto actualizado correctamente" });
    } else {
      console.error("🚨 Error: Producto no encontrado.");
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("🚨 Error al actualizar producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};