import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extender el Request para incluir `user`
declare module "express-serve-static-core" {
  interface Request {
    user?: { usuario_id: number; username: string; rol_id: number };
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      res.status(403).json({ message: "Token requerido" });
      return;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      res.status(400).json({ message: "Formato de token inválido" });
      return;
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secreto_super_seguro") as { usuario_id: number; username: string; rol_id: number };
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Error en la verificación del token:", err);
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export default verifyToken;
