import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBox,
  faTags,
  faBuilding,
  faUsers,
  faUserShield,
  faCogs,
  faClipboardList,
  faBell,
  faFileAlt,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Estado para controlar el modal

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true); // Mostrar el modal al hacer clic en "Cerrar sesión"
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false); // Cerrar el modal
    handleLogout(); // Ejecutar el cierre de sesión
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false); // Cerrar el modal sin hacer nada
  };

  const sidebarItems = [
    { name: "Categorías", icon: faTags, path: "/dashboard/categorias" },
    { name: "Marcas", icon: faBuilding, path: "/dashboard/marcas" },
    { name: "Proveedores", icon: faUsers, path: "/dashboard/proveedores" },
    { name: "Roles", icon: faUserShield, path: "/dashboard/roles" },
    { name: "Usuarios", icon: faUsers, path: "/dashboard/usuarios" },
    { name: "Productos", icon: faBox, path: "/dashboard/productos" },
    { name: "Movimientos", icon: faClipboardList, path: "/dashboard/movimientos" },
    { name: "Alertas", icon: faBell, path: "/dashboard/alertas" },
    { name: "Reportes", icon: faFileAlt, path: "/dashboard/reportes" },
    { name: "Configuración", icon: faCogs, path: "/dashboard/configuracion" },
  ];

  return (
    <div className={`bg-gray-800 text-white ${isOpen ? "w-64" : "w-16"} transition-all duration-300 fixed top-0 left-0 h-screen z-50`}>
      {/* Botón de toggle del Sidebar */}
      <div className="p-4">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      {/* Navegación del Sidebar */}
      <nav>
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.name} className="hover:bg-gray-700 cursor-pointer">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `p-4 flex items-center ${isActive ? "text-yellow-400" : "text-white"}`
                }
              >
                <FontAwesomeIcon icon={item.icon} className="mr-2" />
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Botón de Cerrar Sesión */}
      <div className="absolute bottom-4 left-0 w-full">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center bg-blue-900 py-2 text-white hover:bg-blue-800"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          {isOpen && <span>Cerrar sesión</span>}
        </button>
      </div>

      {/* Modal de Confirmación */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white w-96">
            <h3 className="text-2xl font-bold mb-6 text-center">¿Estás seguro de cerrar sesión?</h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelLogout}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="bg-[#0f9d75] hover:bg-[#0f9d75] px-6 py-3 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;