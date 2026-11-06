import { Router } from "express";
import { loginController, meController, registerController } from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

// Rotas de cadastro, autenticação e sessão do usuário.
export const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.get("/me", authMiddleware, meController);
