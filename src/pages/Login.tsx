import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import { setToken } from "../utils/localStorage";
import { ToastContainer, toast, Slide, Zoom, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState<{ username: string; password: string }>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;
    setLoading(true);
  
    if (!username || !password) {
      showToast("⚠️ Completa todos los campos.", "warn", Zoom);
      setLoading(false);
      return;
    }
  
    try {
      const response = await loginUser(username, password);
      if (!response.token) {
        showToast("⚠️ Error al obtener el token. Inténtalo nuevamente.", "error", Slide);
        setLoading(false);
        return;
      }
  
      setToken(response.token);
      localStorage.setItem("nombre_completo", response.nombre_completo);
  
      showToast("🎉 ¡Inicio de sesión exitoso!", "success", Bounce, "#10b981");
      setIsRedirecting(true);
  
      setTimeout(() => {
        navigate("/dashboard");
        window.location.reload();
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "❌ Error desconocido al iniciar sesión";
      showToast(errorMessage, "error", Slide);
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "warn" | "success" | "error", transition: typeof Slide | typeof Zoom | typeof Bounce, color?: string) => {
    toast[type](message, {
      position: "top-right",
      theme: "colored",
      transition,
      style: color ? { backgroundColor: color } : undefined,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1f2937]">
      <div className="bg-[#374151] p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-600 text-white">
        <h1 className="text-2xl font-bold text-center mb-6">🔐 Iniciar Sesión</h1>

        <ToastContainer autoClose={3000} hideProgressBar={false} closeOnClick draggable theme="colored" />

        {!isRedirecting ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Nombre de Usuario"
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-[#10b981] outline-none"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                className="w-full pl-10 pr-3 py-3 border rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-[#10b981] outline-none"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#10b981] text-white py-3 rounded-lg hover:bg-[#0f9d75] transition duration-300 shadow-md"
              disabled={loading}
            >
              {loading ? "⏳ Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>
        ) : (
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10b981]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
