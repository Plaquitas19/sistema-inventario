import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUserFriends, FaSearch, FaEdit, FaPlusCircle } from "react-icons/fa";

interface Rol {
  rol_id: number;
  nombre_rol: string;
  descripcion: string;
}

const Roles = () => {
  const [nombreRol, setNombreRol] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [roles, setRoles] = useState<Rol[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Rol[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<Rol | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/roles/listar");
        if (!response.ok) throw new Error("Error al obtener roles");
        const data: Rol[] = await response.json();
        setRoles(data);
        setFilteredRoles(data);
        // Eliminado: toast.success("Roles cargados con éxito");
      } catch (error) {
        setError("No se pudieron cargar los roles");
        toast.error("Error al cargar los roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    setFilteredRoles(
      roles.filter((rol) =>
        rol.nombre_rol.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, roles]);

  useEffect(() => {
    if (selectedRole) {
      setNombreRol(selectedRole.nombre_rol);
      setDescripcion(selectedRole.descripcion);
      toast.info("Rol seleccionado para edición");
    }
  }, [selectedRole]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!nombreRol) return toast.error("El nombre del rol es obligatorio");
    try {
      let response;
      let data;
      const token = localStorage.getItem("token");

      if (selectedRole) {
        response = await fetch(`http://localhost:5000/api/roles/${selectedRole.rol_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre_rol: nombreRol, descripcion }),
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al actualizar el rol");
        toast.success("Rol actualizado con éxito");
        setRoles((prev) =>
          prev.map((rol) =>
            rol.rol_id === selectedRole.rol_id ? { ...rol, nombre_rol: nombreRol, descripcion } : rol
          )
        );
      } else {
        response = await fetch("http://localhost:5000/api/roles/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ nombre_rol: nombreRol, descripcion }),
        });

        data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al registrar el rol");
        toast.success("Rol registrado con éxito");
        setRoles([...roles, { rol_id: data.rol_id, nombre_rol: nombreRol, descripcion }]);
      }

      setNombreRol("");
      setDescripcion("");
      setSelectedRole(null);
    } catch (error) {
      toast.error("Error al registrar/actualizar el rol");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-[#1f2937] p-8 rounded-xl shadow-lg border border-gray-600 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaUserFriends className="text-3xl text-[#0f9d75] mr-2" />
          <h2 className="text-3xl font-bold">Roles</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Buscar rol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60 p-2 pl-10 border rounded-full bg-gray-800 text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={nombreRol}
            onChange={(e) => setNombreRol(e.target.value)}
            className="w-full p-3 border rounded-full bg-gray-800 text-white focus:ring-2 focus:ring-[#0f9d75] outline-none"
            placeholder="Nombre del rol"
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
              selectedRole ? "bg-yellow-500 hover:bg-yellow-600" : "bg-[#0f9d75] hover:bg-[#0f9d75]"
            }`}
          >
            {selectedRole ? <FaEdit className="text-2xl" /> : <FaPlusCircle className="text-2xl" />}
          </button>
        </div>
      </form>

      <h3 className="text-2xl font-bold mt-8">Lista de Roles</h3>

      {loading ? (
        <p className="text-gray-400">Cargando roles...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {filteredRoles.map((rol) => (
            <li
              key={rol.rol_id}
              className="bg-gray-800 p-3 rounded-lg shadow-md border border-gray-700 flex justify-between items-center"
            >
              <span className="font-semibold">{rol.nombre_rol}</span>
              <span className="text-gray-400">{rol.descripcion}</span>
              <button onClick={() => setSelectedRole(rol)} className="text-[#0f9d75] hover:text-[#0f9d75]">
                <FaEdit className="text-xl" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Roles;