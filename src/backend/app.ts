import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import verifyToken from "./middlewares/verifyToken";

const app = express();

// ✅ Configurar CORS correctamente para permitir peticiones desde Vercel y localhost
app.use(cors({
  origin: ["http://localhost:5173", "https://sistema-inventario-theta.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Middleware para analizar JSON en las peticiones
app.use(bodyParser.json());

// ✅ Ruta raíz para evitar el error "Cannot GET /"
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Servidor funcionando correctamente en Vercel.");
});

// ✅ Cargar todas las rutas
app.use("/api", authRoutes);

// ✅ Ruta protegida del dashboard
app.get("/api/dashboard", verifyToken, (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }
  res.status(200).json({ message: `Bienvenido ${req.user.username} al Dashboard` });
});

// ✅ Iniciar el servidor en el puerto correcto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});