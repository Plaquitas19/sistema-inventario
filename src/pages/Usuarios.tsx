import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaUserPlus, FaSearch, FaEdit, FaTrashAlt, FaEye, FaEyeSlash } from "react-icons/fa";

interface Usuario {
  usuario_id: number;
  username: string;
  nombre_completo: string;
  email: string;
  rol_id: number;
  activo: boolean;
}

interface Role {
  rol_id: number;
  nombre_rol: string;
}

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolId, setRolId] = useState<number | string>("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null); // Estado para controlar la edición
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/usuarios/listar");
        if (!response.ok) throw new Error("Error al obtener usuarios");
        const data: Usuario[] = await response.json();
        setUsuarios(data);
        setFilteredUsuarios(data);
      } catch (error) {
        toast.error("No se pudieron cargar los usuarios");
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchUsuarios();
  }, []);

  useEffect(() => {
    setFilteredUsuarios(
      usuarios.filter((usuario) =>
        usuario.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, usuarios]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/roles");
        if (!response.ok) throw new Error("Error al obtener roles");
        const data: Role[] = await response.json();
        setRoles(data);
      } catch (error) {
        toast.error("No se pudieron cargar los roles");
        console.error("Error al obtener roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  
    // Validar si los campos son obligatorios
    if (!username || !nombreCompleto || !email || !rolId) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
  
    try {
      setLoading(true);
  
      // Si estamos editando un usuario
      if (editing) {
        const updatedData: any = {
          username,
          nombre_completo: nombreCompleto,
          email,
          rol_id: Number(rolId),
          activo: true,
        };
  
        if (password) {
          updatedData.password = password;
        }
  
        let response = await fetch(`http://localhost:5000/api/usuarios/${editing.usuario_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
  
        let data = await response.json();
  
        if (!response.ok) throw new Error(data.message || "Error al actualizar el usuario");
  
        setUsuarios((prev) =>
          prev.map((usuario) =>
            usuario.usuario_id === editing.usuario_id
              ? { ...usuario, ...updatedData }
              : usuario
          )
        );
  
        toast.success("Usuario actualizado con éxito");
      } else {
        // Registrar un nuevo usuario
        let response = await fetch("http://localhost:5000/api/usuarios/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            nombre_completo: nombreCompleto,
            email,
            password,
            rol_id: Number(rolId),
          }),
        });
  
        let data = await response.json();
  
        if (!response.ok) throw new Error(data.message || "Error al registrar el usuario");
  
        toast.success("Usuario registrado con éxito");
  
        setUsuarios((prev) => [
          ...prev,
          { usuario_id: data.usuario_id, username, nombre_completo: nombreCompleto, email, rol_id: Number(rolId), activo: true },
        ]);
      }
  
      // Limpiar los campos después de guardar
      setUsername("");
      setNombreCompleto("");
      setEmail("");
      setPassword("");
      setRolId("");
    } catch (error) {
      toast.error("Error al guardar el usuario");
      console.error("Error al guardar el usuario:", error);
    } finally {
      setLoading(false);
      setEditing(null); // Resetear el estado de edición
    }
  };
  

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar usuario");

      setUsuarios(usuarios.filter((usuario) => usuario.usuario_id !== id));
      setFilteredUsuarios(filteredUsuarios.filter((usuario) => usuario.usuario_id !== id));
      toast.success("Usuario eliminado con éxito");
    } catch (error) {
      toast.error("No se pudo eliminar el usuario");
      console.error("Error al eliminar usuario:", error);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    // Setear los valores del usuario en el formulario para edición
    setUsername(usuario.username);
    setNombreCompleto(usuario.nombre_completo);
    setEmail(usuario.email);
    setRolId(usuario.rol_id);
    setPassword(""); // Vaciar la contraseña en edición por seguridad
    setEditing(usuario);
    toast.info(`Editando usuario: ${usuario.username}`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-[#1f2937] p-8 rounded-xl shadow-lg border border-gray-700 text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaUserPlus className="text-3xl text-[#10b981] mr-2" />
          <h2 className="text-3xl font-bold">Usuarios</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-60 p-2 pl-10 border rounded-full bg-gray-800 text-white focus:ring-2 focus:ring-[#10b981] outline-none"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Columna 1 */}
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-[#10b981] outline-none"
          />
          <input
            type="text"
            placeholder="Nombre Completo"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-[#10b981] outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-[#10b981] outline-none"
          />
        </div>

        {/* Columna 2 */}
        <div className="space-y-6">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-[#10b981] outline-none"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <select
            value={rolId}
            onChange={(e) => setRolId(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-[#10b981] outline-none"
          >
            <option value="" disabled>Seleccionar Rol</option>
            {roles.map((role) => (
              <option key={role.rol_id} value={role.rol_id}>
                {role.nombre_rol}
              </option>
            ))}
          </select>

          {/* Botón de registrar/editar */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`w-12 h-12 rounded-full transition duration-300 shadow-md flex items-center justify-center ${
                editing
                  ? "bg-yellow-500 hover:bg-yellow-600" // Color para editar
                  : "bg-[#10b981] hover:bg-[#0f9d75]" // Color para registrar
              }`}
            >
              {loading ? (
                <span>Cargando...</span>
              ) : editing ? (
                <FaEdit className="text-white text-xl" /> // Ícono de editar
              ) : (
                <FaUserPlus className="text-white text-xl" /> // Ícono de registrar
              )}
            </button>
          </div>
        </div>
      </form>

      <h3 className="text-2xl font-bold mt-8">Lista de Usuarios</h3>
      <ul className="mt-4 space-y-3">
        {filteredUsuarios.length > 0 ? (
          filteredUsuarios.map((usuario) => {
            const rol = roles.find((role) => role.rol_id === usuario.rol_id);
            return (
              <li key={usuario.usuario_id} className="bg-gray-800 p-3 rounded-lg shadow-md border border-gray-600 flex justify-between items-center">
                <span className="font-semibold text-white">{usuario.username}</span>
                <span className="text-gray-400">{usuario.nombre_completo}</span>
                <span className="text-gray-400">{usuario.email}</span>
                <span className="text-gray-400">{rol ? rol.nombre_rol : "Rol no encontrado"}</span>
                <div className="flex items-center space-x-3">
                  <button onClick={() => handleEdit(usuario)} className="text-yellow-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(usuario.usuario_id)} className="text-red-500">
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-gray-400">No hay usuarios disponibles.</p>
        )}
      </ul>
    </div>
  );
};

export default Usuarios;
