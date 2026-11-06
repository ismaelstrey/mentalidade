import { Router } from "express";
import { listTagsController, listThemesController } from "../controllers/catalogController";

// Rotas públicas de catálogo (temas e tags).
export const catalogRoutes = Router();

catalogRoutes.get("/themes", listThemesController);
catalogRoutes.get("/tags", listTagsController);
