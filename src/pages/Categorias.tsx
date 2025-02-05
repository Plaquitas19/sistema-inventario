import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlusCircle, FaSearch } from "react-icons/fa";

interface Categoria {
  categoria_id: number;
  nombre: string;
  descripcion: string;
  created_at: string;
  updated_at: string;
}

const Categorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filteredCategorias, setFilteredCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categorias");
        if (!response.ok) throw new Error("Error al obtener categorías");
        const data: Categoria[] = await response.json();
        setCategorias(data);
        setFilteredCategorias(data);
      } catch (error) {
        setError("No se pudieron cargar las categorías");
        toast.error("Error al cargar las categorías"); // Notificación de error
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    setFilteredCategorias(
      categorias.filter((categoria) =>
        categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, categorias]);

  useEffect(() => {
    if (selectedCategoria) {
      setNombre(selectedCategoria.nombre);
      setDescripcion(selectedCategoria.descripcion);
      toast.info("Categoría seleccionada para edición"); // Notificación de selección
    }
  }, [selectedCategoria]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nombre) return toast.error("El nombre de la categoría es obligatorio"); // Validación
    try {
      let response;
      let data;
      const token = localStorage.getItem("token");

      if (selectedCategoria) {
        response = await fetch(`http://localhost:5000/api/categorias/${selectedCategoria.categoria_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre, descripcion }),
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al actualizar la categoría");
        toast.success("Categoría actualizada con éxito"); // Notificación de éxito
        setCategorias((prev) =>
          prev.map((categoria) =>
            categoria.categoria_id === selectedCategoria.categoria_id ? { ...categoria, nombre, descripcion } : categoria
          )
        );
      } else {
        response = await fetch("http://localhost:5000/api/categorias/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre, descripcion }),
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al registrar la categoría");
        toast.success("Categoría registrada con éxito"); // Notificación de éxito
        setCategorias([...categorias, { categoria_id: data.categoria_id, nombre, descripcion, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
      }

      setNombre("");
      setDescripcion("");
      setSelectedCategoria(null);
    } catch (error) {
      toast.error("Error al registrar/actualizar la categoría"); // Notificación de error
    }
  };

  const handleDelete = async (categoriaId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/categorias/${categoriaId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al eliminar la categoría");

      toast.success("Categoría eliminada con éxito"); // Notificación de éxito
      setCategorias(categorias.filter((categoria) => categoria.categoria_id !== categoriaId));
    } catch (error) {
      toast.error("Error al eliminar la categoría"); // Notificación de error
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-[#1f2937] p-8 rounded-xl shadow-lg border border-gray-600 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold">Categorías</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60 p-2 pl-10 border rounded-full bg-gray-800 text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-3 border rounded-full bg-gray-800 text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
            placeholder="Nombre de la categoría"
          />
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-3 border rounded-full bg-gray-800 text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
            placeholder="Descripción"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`text-white p-4 rounded-full shadow-lg flex items-center ${
              selectedCategoria ? "bg-yellow-500 hover:bg-yellow-600" : "bg-[#0f9d75] hover:bg-[#0f9d75]"
            }`}
          >
            {selectedCategoria ? <FaEdit className="text-2xl" /> : <FaPlusCircle className="text-2xl" />}
          </button>
        </div>
      </form>

      <h3 className="text-2xl font-bold mt-8">Lista de Categorías</h3>

      {loading ? (
        <p className="text-gray-400">Cargando categorías...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filteredCategorias.map((categoria) => (
            <li
              key={categoria.categoria_id}
              className="bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 flex justify-between items-center"
            >
              <span className="font-semibold">{categoria.nombre}</span>
              <span className="text-gray-400">{categoria.descripcion}</span>
              <div className="flex items-center space-x-3">
                <button onClick={() => setSelectedCategoria(categoria)} className="text-[#0f9d75] hover:text-[#0f9d75]">
                  <FaEdit className="text-xl" />
                </button>
                <button
                  onClick={() => handleDelete(categoria.categoria_id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash className="text-xl" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Categorias;