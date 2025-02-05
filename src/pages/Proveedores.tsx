import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlusCircle, FaSearch } from "react-icons/fa";

interface Proveedor {
  proveedor_id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
}

const Proveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [filteredProveedores, setFilteredProveedores] = useState<Proveedor[]>([]);
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/proveedores");
        if (!response.ok) throw new Error("Error al obtener proveedores");
        const data: Proveedor[] = await response.json();
        setProveedores(data);
        setFilteredProveedores(data);
      } catch (error) {
        setError("No se pudieron cargar los proveedores");
        toast.error("Error al cargar proveedores");
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  useEffect(() => {
    setFilteredProveedores(
      proveedores.filter((proveedor) =>
        proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, proveedores]);

  useEffect(() => {
    if (selectedProveedor) {
      setNombre(selectedProveedor.nombre);
      setContacto(selectedProveedor.contacto);
      setTelefono(selectedProveedor.telefono);
      setEmail(selectedProveedor.email);
      setDireccion(selectedProveedor.direccion);
      toast.info("Proveedor seleccionado para edición");
    }
  }, [selectedProveedor]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nombre) return toast.error("El nombre del proveedor es obligatorio");

    try {
      let response;
      let data;
      const token = localStorage.getItem("token");

      if (selectedProveedor) {
        response = await fetch(`http://localhost:5000/api/proveedores/${selectedProveedor.proveedor_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre, contacto, telefono, email, direccion }),
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al actualizar el proveedor");
        toast.success("Proveedor actualizado con éxito");
        setProveedores((prev) =>
          prev.map((proveedor) =>
            proveedor.proveedor_id === selectedProveedor.proveedor_id
              ? { ...proveedor, nombre, contacto, telefono, email, direccion }
              : proveedor
          )
        );
      } else {
        response = await fetch("http://localhost:5000/api/proveedores/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre, contacto, telefono, email, direccion }),
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al registrar el proveedor");
        toast.success("Proveedor registrado con éxito");
        setProveedores([...proveedores, { proveedor_id: data.proveedor_id, nombre, contacto, telefono, email, direccion }]);
      }

      setNombre("");
      setContacto("");
      setTelefono("");
      setEmail("");
      setDireccion("");
      setSelectedProveedor(null);
    } catch (error) {
      toast.error("Error al registrar/actualizar el proveedor");
    }
  };

  const handleDelete = async (proveedorId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/proveedores/${proveedorId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al eliminar el proveedor");

      toast.success("Proveedor eliminado con éxito");
      setProveedores(proveedores.filter((proveedor) => proveedor.proveedor_id !== proveedorId));
    } catch (error) {
      toast.error("Error al eliminar el proveedor");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-[#1f2937] p-8 rounded-xl shadow-lg border border-gray-600 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold">Proveedores</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar proveedor..."
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
            placeholder="Nombre del proveedor"
          />
          <input
            type="text"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            className="w-full p-3 border rounded-full bg-gray-800 text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
            placeholder="Contacto"
          />
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full p-3 border rounded-full bg-gray-800 text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
            placeholder="Teléfono"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-full bg-gray-800 text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
            placeholder="Email"
          />
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full p-3 border rounded-full bg-gray-800 text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
            placeholder="Dirección"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className={`text-white p-4 rounded-full shadow-lg flex items-center ${
              selectedProveedor ? "bg-yellow-500 hover:bg-yellow-600" : "bg-[#0f9d75] hover:bg-[#0f9d75]"
            }`}
          >
            {selectedProveedor ? <FaEdit className="text-2xl" /> : <FaPlusCircle className="text-2xl" />}
          </button>
        </div>
      </form>

      <h3 className="text-2xl font-bold mt-8">Lista de Proveedores</h3>

      {loading ? (
        <p className="text-gray-400">Cargando proveedores...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filteredProveedores.map((proveedor) => (
            <li
              key={proveedor.proveedor_id}
              className="bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 flex justify-between items-center"
            >
              <div>
                <span className="font-semibold">{proveedor.nombre}</span>
                <span className="text-gray-400 block">{proveedor.contacto}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => setSelectedProveedor(proveedor)} className="text-[#0f9d75] hover:text-[#0f9d75]">
                  <FaEdit className="text-xl" />
                </button>
                <button
                  onClick={() => handleDelete(proveedor.proveedor_id)}
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

export default Proveedores;