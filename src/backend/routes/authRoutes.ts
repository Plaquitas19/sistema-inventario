import express from "express";
import { login } from "../controllers/authController";
import { getMarcas, createMarca, updateMarca, deleteMarca } from "../controllers/marcasController";
import { getRolesNombre, registerUser, getUsuarios, updateUsuario, deleteUsuario } from "../controllers/usuariosController";
import { getRoles, createRole, updateRole } from "../controllers/rolesController";
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "../controllers/categoriasController";
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from "../controllers/proveedoresController";
import { getProductos, createProducto, updateProducto } from "../controllers/productosController";

const router = express.Router();

// 📌 Rutas para autenticación y roles
router.post("/login", login);
router.get("/roles/listar", getRoles);
router.post("/roles/create", createRole);
router.put("/roles/:id", updateRole);
router.get("/roles", getRolesNombre);

// 📌 Rutas para usuarios
router.get("/usuarios/listar", getUsuarios);
router.post("/usuarios/register", registerUser);
router.put("/usuarios/:id", updateUsuario);
router.delete("/usuarios/:id", deleteUsuario);

// 📌 Rutas para marcas
router.get("/marcas", getMarcas);
router.post("/marcas/create", createMarca);
router.put("/marcas/:id", updateMarca);
router.delete("/marcas/:id", deleteMarca);

// 📌 Rutas para categorías
router.get("/categorias", getCategorias);
router.post("/categorias/create", createCategoria);
router.put("/categorias/:id", updateCategoria);
router.delete("/categorias/:id", deleteCategoria);

// 📌 Rutas para proveedores
router.get("/proveedores", getProveedores);
router.post("/proveedores/create", createProveedor);
router.put("/proveedores/:id", updateProveedor);
router.delete("/proveedores/:id", deleteProveedor);

// 📌 Rutas para productos
router.get("/productos", getProductos);
router.post("/productos/create", createProducto);
router.put("/productos/:id", updateProducto);

export default router;
