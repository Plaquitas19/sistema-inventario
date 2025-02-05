import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUserCircle } from "@fortawesome/free-solid-svg-icons";

interface NavbarProps {
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen }) => {
  const nombreCompleto = localStorage.getItem("nombre_completo") || "Usuario";

  return (
    <div
      className={`flex items-center justify-between bg-gray-800 text-white px-4 py-2 shadow-md ${
        isSidebarOpen ? "ml-64" : "ml-16"
      } transition-all duration-300`}
    >
      {/* Left: Branding */}
      <div className="text-lg font-bold">
        <span>Bienvenido, {nombreCompleto}</span>
      </div>

      {/* Right: Options */}
      <div className="flex items-center space-x-4">
        <button className="text-white hover:text-gray-400">
          <FontAwesomeIcon icon={faBell} className="text-lg" />
        </button>
        <button className="text-white hover:text-gray-400">
          <FontAwesomeIcon icon={faUserCircle} className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
