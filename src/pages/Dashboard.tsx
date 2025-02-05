import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getToken } from "../utils/localStorage";

interface DashboardProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Dashboard: React.FC<DashboardProps> = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true); // Marcar como autenticado
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null; // No renderizar nada hasta verificar la autenticación
  }

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 transition-all duration-300">
        {/* Navbar - Se ajusta al tamaño del contenedor */}
        <Navbar isSidebarOpen={isOpen} />

        {/* Contenido Principal - Se ajusta automáticamente */}
        <div
          className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ease-in-out ${
            isOpen ? "ml-64" : "ml-16"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;