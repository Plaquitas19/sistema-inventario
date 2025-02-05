import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaBoxes, FaTimes, FaEdit, FaSave, FaSyncAlt } from "react-icons/fa";

interface Producto {
  producto_id: number;
  sku: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  marca: string;
  proveedor: string;
  precio_compra: number;
  precio_venta: number;
  stock_minimo: number;
  stock_actual: number;
  ubicacion: string;
  categoria_id: number;
  marca_id: number;
  proveedor_id: number;
}

interface Categoria {
  categoria_id: number;
  nombre: string;
}

interface Proveedor {
  proveedor_id: number;
  nombre: string;
}

interface Marca {
  marca_id: number;
  nombre: string;
}

const Productos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState<Producto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Estados para los filtros
  const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null);
  const [filtroProveedor, setFiltroProveedor] = useState<number | null>(null);
  // Filtro de stock
  const [filtroStock, setFiltroStock] = useState<string>("");
  // Filtro estado (añadir/descontar)
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);


  // Función para formatear la moneda local
  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN", // Cambia a "COP" para Colombia, "MXN" para México, etc.
    }).format(valor);
  };

  // Filtrar productos según los filtros seleccionados
  const productosFiltrados = productos.filter((producto) => {
    return (
      (filtroCategoria === null || producto.categoria_id === filtroCategoria) &&
      (filtroProveedor === null || producto.proveedor_id === filtroProveedor) &&
      (filtroStock === "" || 
        (filtroStock === "bajo" && producto.stock_actual <= producto.stock_minimo) ||
        (filtroStock === "suficiente" && producto.stock_actual > producto.stock_minimo)
      )
    );
  }).filter((producto) => producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  // Función para actualizar el stock
const actualizarStock = async (tipo: "añadir" | "descontar") => {
  if (!productoSeleccionado) {
    toast.error("Seleccione un producto.");
    return;
  }

  const cantidad = tipo === "añadir" ? 1 : -1;
  const nuevoStock = productoSeleccionado.stock_actual + cantidad;

  if (nuevoStock < 0) {
    toast.error("No puedes tener stock negativo.");
    return;
  }

  // Confirmación antes de proceder
  const confirmacion = window.confirm(
    `¿Está seguro que desea ${tipo === "añadir" ? "añadir" : "descontar"} 1 unidad al stock de "${productoSeleccionado.nombre}"?`
  );

  if (!confirmacion) return;

  try {
    const response = await fetch(`http://localhost:5000/api/productos/${productoSeleccionado.producto_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...productoSeleccionado, stock_actual: nuevoStock }),
    });

    if (!response.ok) throw new Error("Error al actualizar el stock");

    toast.success(`Stock actualizado correctamente (${nuevoStock} unidades)`);

    // Actualizar el estado de productos en la tabla
    setProductos((prevProductos) =>
      prevProductos.map((prod) =>
        prod.producto_id === productoSeleccionado.producto_id
          ? { ...prod, stock_actual: nuevoStock }
          : prod
      )
    );

    // Limpiar la selección
    setProductoSeleccionado(null);
  } catch (error) {
    toast.error("Error al actualizar el stock");
  }
};


  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProductos, resCategorias, resProveedores, resMarcas] = await Promise.all([
          fetch("http://localhost:5000/api/productos"),
          fetch("http://localhost:5000/api/categorias"),
          fetch("http://localhost:5000/api/proveedores"),
          fetch("http://localhost:5000/api/marcas"),
        ]);

        if (!resProductos.ok || !resCategorias.ok || !resProveedores.ok || !resMarcas.ok) {
          throw new Error("Error al obtener datos");
        }

        const [productosData, categoriasData, proveedoresData, marcasData] = await Promise.all([
          resProductos.json(),
          resCategorias.json(),
          resProveedores.json(),
          resMarcas.json(),
        ]);

        setProductos(productosData);
        setCategorias(categoriasData);
        setProveedores(proveedoresData);
        setMarcas(marcasData);
      } catch (error) {
      }
    };

    fetchData();
  }, []);

  // Abrir modal en modo edición
  const abrirModalEditar = (producto: Producto) => {
    setProductoActual({
      ...producto,
      categoria_id: producto.categoria_id ? Number(producto.categoria_id) : 0,
      marca_id: producto.marca_id ? Number(producto.marca_id) : 0,
      proveedor_id: producto.proveedor_id ? Number(producto.proveedor_id) : 0,
    });
    setModoEdicion(true);
    setModalOpen(true);
  };

  // Abrir modal en modo creación
  const abrirModalAgregar = () => {
    setProductoActual({
      producto_id: 0,
      sku: "",
      nombre: "",
      descripcion: "",
      categoria: "",
      marca: "",
      proveedor: "",
      precio_compra: 0,
      precio_venta: 0,
      stock_minimo: 0,
      stock_actual: 0,
      ubicacion: "",
      categoria_id: 0,
      marca_id: 0,
      proveedor_id: 0,
    });
    setModoEdicion(false);
    setModalOpen(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalOpen(false);
    setModoEdicion(false);
    setProductoActual(null);
  };

  // Manejar el envío del formulario (agregar/editar)
  const handleAgregarEditarProducto = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productoActual) {
      toast.error("Error: No hay producto seleccionado.");
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const productoEditado = Object.fromEntries(formData.entries());

    const productoFinal = {
      ...productoActual,
      categoria_id: Number(productoEditado.categoria_id) || 0,
      marca_id: Number(productoEditado.marca_id) || 0,
      proveedor_id: Number(productoEditado.proveedor_id) || 0,
      precio_compra: Number(productoEditado.precio_compra) || 0,
      precio_venta: Number(productoEditado.precio_venta) || 0,
      stock_minimo: Number(productoEditado.stock_minimo) || 0,
      stock_actual: Number(productoEditado.stock_actual) || 0,
    };

    try {
      let response;
      if (modoEdicion) {
        // Modo edición
        const url = `http://localhost:5000/api/productos/${productoActual.producto_id}`;
        response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoFinal),
        });

        if (!response.ok) throw new Error("Error al actualizar el producto");
        toast.success("Producto actualizado correctamente");
      } else {
        // Modo creación de nuevo producto
        response = await fetch("http://localhost:5000/api/productos/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoFinal),
        });

        if (!response.ok) throw new Error("Error al agregar el producto");
        toast.success("Producto registrado exitosamente");
      }

      cerrarModal();
      const resProductos = await fetch("http://localhost:5000/api/productos");
      const productosData = await resProductos.json();
      setProductos(productosData);
    } catch (error) {
      console.error("Error al actualizar/agregar producto:", error);
      toast.error("Error al actualizar/agregar el producto");
    }
  };

  return (
    <div className="max-w-10xl mx-auto mt-10 bg-[#1f2937] p-8 rounded-xl shadow-lg border border-gray-700 text-white">
      <h2 className="text-4xl font-bold text-center mb-6 flex items-center justify-center">
        <FaBoxes className="mr-2 text-[#0f9d75]" /> Productos
      </h2>

      {/* Contenedor de búsqueda y filtros */}
      <div className="flex gap-4 mb-6 justify-center">
  <input
    type="text"
    placeholder="Buscar por nombre"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="p-3 w-64 rounded-full bg-[#1f2937] border border-[#0f9d75] text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
  />

  {/* Filtro por Categoría */}
  <select
    value={filtroCategoria ?? ""}
    onChange={(e) => setFiltroCategoria(e.target.value ? Number(e.target.value) : null)}
    className="p-3 w-48 rounded-full bg-[#1f2937] border border-[#0f9d75] text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
  >
    <option value="">Todas las Categorías</option>
    {categorias.map((categoria) => (
      <option key={categoria.categoria_id} value={categoria.categoria_id}>
        {categoria.nombre}
      </option>
    ))}
  </select>

  {/* Filtro por Proveedor */}
  <select
    value={filtroProveedor ?? ""}
    onChange={(e) => setFiltroProveedor(e.target.value ? Number(e.target.value) : null)}
    className="p-3 w-48 rounded-full bg-[#1f2937] border border-[#0f9d75] text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
  >
    <option value="">Todos los Proveedores</option>
    {proveedores.map((proveedor) => (
      <option key={proveedor.proveedor_id} value={proveedor.proveedor_id}>
        {proveedor.nombre}
      </option>
    ))}
  </select>

  {/* Filtro por Stock */}
  <select
    value={filtroStock}
    onChange={(e) => setFiltroStock(e.target.value)}
    className="p-3 w-48 rounded-full bg-[#1f2937] border border-[#0f9d75] text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
  >
    <option value="">Todos los Stocks</option>
    <option value="bajo">Stock Bajo</option>
    <option value="suficiente">Stock Suficiente</option>
  </select>

  {/* Botón de reinicio de filtros */}
<button
  onClick={() => {
    setFiltroCategoria(null);
    setFiltroProveedor(null);
    setFiltroStock("");
    setSearchTerm("");
    setProductoSeleccionado(null); // 🔥 Esto deselecciona cualquier radio seleccionado
  }}
  className="p-3 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition"
>
  <FaSyncAlt className="text-[#0f9d75] text-xl" />
</button>


  <button
    onClick={abrirModalAgregar}
    className="p-3 bg-[#0f9d75] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#0c7b5e] transition"
  >
    <FaPlus className="text-xl" />
  </button>
</div>


      {modalOpen && categorias.length > 0 && marcas.length > 0 && proveedores.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1f2937] p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{modoEdicion ? "Editar Producto" : "Agregar Producto"}</h3>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-white">
                <FaTimes className="text-xl" />
              </button>
            </div>
            <form onSubmit={handleAgregarEditarProducto}>
              {/* Campos del formulario */}
              <input
                type="text"
                name="sku"
                placeholder="SKU"
                value={productoActual?.sku || ""}
                onChange={(e) =>
                  setProductoActual((prev) =>
                    prev ? { ...prev, sku: e.target.value } : null
                  )
                }
                className="w-full p-2 my-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
                required
              />

              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={productoActual?.nombre || ""}
                onChange={(e) =>
                  setProductoActual((prev) =>
                    prev ? { ...prev, nombre: e.target.value } : null
                  )
                }
                className="w-full p-2 my-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
                required
              />

              <input
                type="text"
                name="descripcion"
                placeholder="Descripción"
                value={productoActual?.descripcion || ""}
                onChange={(e) =>
                  setProductoActual((prev) =>
                    prev ? { ...prev, descripcion: e.target.value } : null
                  )
                }
                className="w-full p-2 my-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
              />

              <select
                name="categoria_id"
                value={productoActual?.categoria_id || ""}
                onChange={(e) =>
                  setProductoActual((prev) =>
                    prev ? { ...prev, categoria_id: Number(e.target.value) } : null
                  )
                }
                className="w-full p-2 my-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
              >
                <option value="">Seleccionar Categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.categoria_id} value={cat.categoria_id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>

              <select
                name="marca_id"
                value={productoActual?.marca_id || ""}
                onChange={(e) =>
                  setProductoActual((prev) =>
                    prev ? { ...prev, marca_id: Number(e.target.value) } : null
                  )
                }
                className="w-full p-2 my-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
              >
                <option value="">Seleccionar Marca</option>
                {marcas.map((marca) => (
                  <option key={marca.marca_id} value={marca.marca_id}>
                    {marca.nombre}
                  </option>
                ))}
              </select>

              <select
                name="proveedor_id"
                value={productoActual?.proveedor_id || ""}
                onChange={(e) =>
                  setProductoActual((prev) =>
                    prev ? { ...prev, proveedor_id: Number(e.target.value) } : null
                  )
                }
                className="w-full p-2 my-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
              >
                <option value="">Seleccionar Proveedor</option>
                {proveedores.map((prov) => (
                  <option key={prov.proveedor_id} value={prov.proveedor_id}>
                    {prov.nombre}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="precio_compra"
                placeholder="Precio Compra"
                value={productoActual?.precio_compra || ""}
                onChange={(e) =>
                  setProductoActual((prev) =>
                    prev ? { ...prev, precio_compra: Number(e.target.value) } : null
                  )
                }
                className="w-full p-2 my-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
                required
              />

              <input
                type="number"
                name="precio_venta"
                placeholder="Precio Venta"
                value={productoActual?.precio_venta || ""}
                onChange={(e) =>
                  setProductoActual((prev) =>
                    prev ? { ...prev, precio_venta: Number(e.target.value) } : null
                  )
                }
                className="w-full p-2 my-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
                required
              />

              <input
                type="number"
                name="stock_minimo"
                placeholder="Stock Mínimo"
                value={productoActual?.stock_minimo || ""}
                onChange={(e) =>
                  setProductoActual((prev) =>
                    prev ? { ...prev, stock_minimo: Number(e.target.value) } : null
                  )
                }
                className="w-full p-2 my-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
                required
              />

              <input
                type="number"
                name="stock_actual"
                placeholder="Stock Actual"
                value={productoActual?.stock_actual || ""}
                onChange={(e) =>
                  setProductoActual((prev) =>
                    prev ? { ...prev, stock_actual: Number(e.target.value) } : null
                  )
                }
                className="w-full p-2 my-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
                required
              />

              <input
                type="text"
                name="ubicacion"
                placeholder="Ubicación"
                value={productoActual?.ubicacion || ""}
                onChange={(e) =>
                  setProductoActual((prev) =>
                    prev ? { ...prev, ubicacion: e.target.value } : null
                  )
                }
                className="w-full p-2 my-2 bg-gray-800 rounded-lg border border-gray-700 text-white"
                required
              />

              <button
                type="submit"
                className={`w-full p-3 rounded-full text-white flex items-center justify-center ${
                  modoEdicion ? "bg-yellow-500 hover:bg-yellow-600" : "bg-[#0f9d75] hover:bg-[#0c7b5e]"
                }`}
              >
                {modoEdicion ? <FaSave className="mr-2" /> : <FaPlus className="mr-2" />}
                {modoEdicion ? "Guardar cambios" : "Agregar"}
              </button>
            </form>
          </div>
        </div>
      )}

<div className="overflow-hidden w-full bg-gray-900 p-4 rounded-lg shadow-lg">
  <table className="w-full text-left text-gray-200 table-auto">
    <thead>
      <tr className="bg-gray-800 text-white">
        <th className="p-3">Seleccionar</th>
        <th className="p-3">SKU</th>
        <th className="p-3">Nombre</th>
        <th className="p-3">Descripción</th>
        <th className="p-3">Categoría</th>
        <th className="p-3">Marca</th>
        <th className="p-3">Proveedor</th>
        <th className="p-3">Precio Compra</th>
        <th className="p-3">Precio Venta</th>
        <th className="p-3">Stock Mínimo</th>
        <th className="p-3">Stock Actual</th>
        <th className="p-3">Ubicación</th>
        <th className="p-3">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {productosFiltrados.map((producto) => (
        <tr key={producto.producto_id} className="border-t border-gray-700 hover:bg-gray-800">
          <td className="p-3 text-center">
            <input
              type="radio"
              name="productoSeleccionado"
              checked={productoSeleccionado?.producto_id === producto.producto_id}
              onChange={() => setProductoSeleccionado(producto)}
              className="h-5 w-5 cursor-pointer"
            />
          </td>
          <td className="p-3">{producto.sku}</td>
          <td className="p-3">{producto.nombre}</td>
          <td className="p-3 truncate max-w-xs">{producto.descripcion}</td>
          <td className="p-3">{producto.categoria}</td>
          <td className="p-3">{producto.marca}</td>
          <td className="p-3">{producto.proveedor}</td>
          <td className="p-3">{formatearMoneda(producto.precio_compra)}</td>
          <td className="p-3">{formatearMoneda(producto.precio_venta)}</td>
          <td className="p-3">{producto.stock_minimo}</td>
          <td className="p-3">{producto.stock_actual}</td>
          <td className="p-3">{producto.ubicacion}</td>
          <td className="p-3">
            <button
              onClick={() => abrirModalEditar(producto)}
              className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
            >
              <FaEdit />
            </button>
          </td>
        </tr>
      ))}
    </tbody>

        </table>
            {productoSeleccionado && (
            <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => actualizarStock("añadir")}
              className="p-3 w-48 rounded-full border border-[#0f9d75] text-[#0f9d75] bg-transparent hover:bg-[#0f9d75] hover:text-white transition shadow-md"
            >
              + Añadir 1 al Stock
            </button>
          
            <button
              onClick={() => actualizarStock("descontar")}
              className="p-3 w-48 rounded-full border border-[#0f9d75] text-[#0f9d75] bg-transparent hover:bg-[#0f9d75] hover:text-white transition shadow-md"
            >
              - Descontar 1 del Stock
            </button>
          </div>
          
          
          
          )}

      </div>
    </div>
  );
};

export default Productos;