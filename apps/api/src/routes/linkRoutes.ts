import { Router } from "express";
import { previewController } from "../controllers/linkController";
import { authMiddleware } from "../middlewares/authMiddleware";

// Rotas de metadados de links.
export const linkRoutes = Router();

linkRoutes.post("/preview", authMiddleware, previewController);
