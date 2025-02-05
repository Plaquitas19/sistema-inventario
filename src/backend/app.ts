import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import verifyToken from "./middlewares/verifyToken";


const app = express();

// Configurar CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(bodyParser.json());

// ✅ Cargar todas las rutas
app.use("/api", authRoutes);


app.get("/api/dashboard", verifyToken, (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }
  res.status(200).json({ message: `Bienvenido ${req.user.username} al Dashboard` });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
