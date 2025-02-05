import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify"; // Importar ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importar estilos de toastify
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reportes from "./pages/Reportes";
import Categorias from "./pages/Categorias";
import Marcas from "./pages/Marcas";
import Proveedores from "./pages/Proveedores";
import Roles from "./pages/Roles";
import Usuarios from "./pages/Usuarios";
import Productos from "./pages/Productos";
import Movimientos from "./pages/Movimientos";
import Alertas from "./pages/Alertas";
import { getToken } from "./utils/localStorage";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const token = getToken(); // Leer el token aquí

  return (
    <Router>
      {/* ToastContainer para mostrar notificaciones */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Routes>
        {/* Ruta pública para el login */}
        <Route path="/login" element={<Login />} />

        {/* Rutas privadas protegidas dentro del Dashboard */}
        <Route
          path="/dashboard"
          element={token ? (
            <Dashboard isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          ) : (
            <Navigate to="/login" />
          )}
        >
          <Route path="reportes" element={<Reportes />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="marcas" element={<Marcas />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="roles" element={<Roles />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="productos" element={<Productos />} />
          <Route path="movimientos" element={<Movimientos />} />
          <Route path="alertas" element={<Alertas />} />
        </Route>

        {/* Redirigir rutas desconocidas al Dashboard si hay sesión, de lo contrario al Login */}
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;