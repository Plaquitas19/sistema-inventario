import { Routes, Route } from "react-router-dom";
import ReportesComponent from "../pages/Reportes";
import CategoriasComponent from "../pages/Categorias";
import MarcasComponent from "../pages/Marcas";
import ProveedoresComponent from "../pages/Proveedores";
import RolesComponent from "../pages/Roles";
import UsuariosComponent from "../pages/Usuarios";
import ProductosComponent from "../pages/Productos";
import MovimientosComponent from "../pages/Movimientos";
import AlertasComponent from "../pages/Alertas";

const MainContent = () => {
  return (
    <div className="flex-1 bg-gray-100 overflow-auto p-6 transition-all duration-300">
      <Routes>
        <Route path="/reportes" element={<ReportesComponent />} />
        <Route path="/categorias" element={<CategoriasComponent />} />
        <Route path="/marcas" element={<MarcasComponent />} />
        <Route path="/proveedores" element={<ProveedoresComponent />} />
        <Route path="/roles" element={<RolesComponent />} />
        <Route path="/usuarios" element={<UsuariosComponent />} />
        <Route path="/productos" element={<ProductosComponent />} />
        <Route path="/movimientos" element={<MovimientosComponent />} />
        <Route path="/alertas" element={<AlertasComponent />} />
      </Routes>
    </div>
  );
};

export default MainContent;
