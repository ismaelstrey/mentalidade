import { Router } from "express";
import {
  getFeedController,
  getGamificationController,
  getRankingController,
} from "../controllers/gamificationController";
import { authMiddleware, optionalAuthMiddleware } from "../middlewares/authMiddleware";

// Rotas de gamificação: estatísticas, ranking e feed.
export const gamificationRoutes = Router();

gamificationRoutes.get("/ranking", optionalAuthMiddleware, getRankingController);
gamificationRoutes.get("/feed", optionalAuthMiddleware, getFeedController);
gamificationRoutes.get("/", authMiddleware, getGamificationController);
