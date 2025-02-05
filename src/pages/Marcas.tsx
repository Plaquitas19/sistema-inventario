import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlusCircle, FaSearch } from "react-icons/fa";

interface Marca {
  marca_id: number;
  nombre: string;
  pais_origen: string;
}

const Marcas = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [filteredMarcas, setFilteredMarcas] = useState<Marca[]>([]);
  const [nombre, setNombre] = useState("");
  const [paisOrigen, setPaisOrigen] = useState("");
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/marcas");
        if (!response.ok) throw new Error("Error al obtener marcas");
        const data: Marca[] = await response.json();
        setMarcas(data);
        setFilteredMarcas(data);
      } catch (error) {
        setError("No se pudieron cargar las marcas");
        toast.error("Error al cargar las marcas"); // Notificación de error
      } finally {
        setLoading(false);
      }
    };

    fetchMarcas();
  }, []);

  useEffect(() => {
    setFilteredMarcas(
      marcas.filter((marca) =>
        marca.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, marcas]);

  useEffect(() => {
    if (selectedMarca) {
      setNombre(selectedMarca.nombre);
      setPaisOrigen(selectedMarca.pais_origen);
      toast.info("Marca seleccionada para edición"); // Notificación de selección
    }
  }, [selectedMarca]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nombre) return toast.error("El nombre de la marca es obligatorio"); // Validación
    try {
      let response;
      let data;
      const token = localStorage.getItem("token");

      if (selectedMarca) {
        response = await fetch(`http://localhost:5000/api/marcas/${selectedMarca.marca_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre, pais_origen: paisOrigen }),
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al actualizar la marca");
        toast.success("Marca actualizada con éxito"); // Notificación de éxito
        setMarcas((prev) =>
          prev.map((marca) =>
            marca.marca_id === selectedMarca.marca_id ? { ...marca, nombre, pais_origen: paisOrigen } : marca
          )
        );
      } else {
        response = await fetch("http://localhost:5000/api/marcas/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre, pais_origen: paisOrigen }),
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al registrar la marca");
        toast.success("Marca registrada con éxito"); // Notificación de éxito
        setMarcas([...marcas, { marca_id: data.marca_id, nombre, pais_origen: paisOrigen }]);
      }

      setNombre("");
      setPaisOrigen("");
      setSelectedMarca(null);
    } catch (error) {
      toast.error("Error al registrar/actualizar la marca"); // Notificación de error
    }
  };

  const handleDelete = async (marcaId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/marcas/${marcaId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al eliminar la marca");

      toast.success("Marca eliminada con éxito"); // Notificación de éxito
      setMarcas(marcas.filter((marca) => marca.marca_id !== marcaId));
    } catch (error) {
      toast.error("Error al eliminar la marca"); // Notificación de error
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-[#1f2937] p-8 rounded-xl shadow-lg border border-gray-600 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold">Marcas</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar marca..."
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
            placeholder="Nombre de la marca"
          />
          <input
            type="text"
            value={paisOrigen}
            onChange={(e) => setPaisOrigen(e.target.value)}
            className="w-full p-3 border rounded-full bg-gray-800 text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
            placeholder="País de origen"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`text-white p-4 rounded-full shadow-lg flex items-center ${
              selectedMarca ? "bg-yellow-500 hover:bg-yellow-600" : "bg-[#0f9d75] hover:bg-[#0f9d75]"
            }`}
          >
            {selectedMarca ? <FaEdit className="text-2xl" /> : <FaPlusCircle className="text-2xl" />}
          </button>
        </div>
      </form>

      <h3 className="text-2xl font-bold mt-8">Lista de Marcas</h3>

      {loading ? (
        <p className="text-gray-400">Cargando marcas...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filteredMarcas.map((marca) => (
            <li
              key={marca.marca_id}
              className="bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 flex justify-between items-center"
            >
              <span className="font-semibold">{marca.nombre}</span>
              <span className="text-gray-400">{marca.pais_origen}</span>
              <div className="flex items-center space-x-3">
                <button onClick={() => setSelectedMarca(marca)} className="text-[#0f9d75] hover:text-[#0f9d75]">
                  <FaEdit className="text-xl" />
                </button>
                <button
                  onClick={() => handleDelete(marca.marca_id)}
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

export default Marcas;