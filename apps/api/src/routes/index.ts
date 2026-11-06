import { Router } from "express";
import { healthController } from "../controllers/healthController";
import { authRoutes } from "./authRoutes";
import { catalogRoutes } from "./catalogRoutes";
import { gamificationRoutes } from "./gamificationRoutes";
import { goalRoutes } from "./goalRoutes";
import { habitRoutes } from "./habitRoutes";
import { journalRoutes } from "./journalRoutes";
import { linkRoutes } from "./linkRoutes";
import { listRoutes } from "./listRoutes";
import { userRoutes } from "./userRoutes";

// Agrega todas as rotas da API.
export const router = Router();

router.get("/health", healthController);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/lists", listRoutes);
router.use("/habits", habitRoutes);
router.use("/goals", goalRoutes);
router.use("/journal", journalRoutes);
router.use("/gamification", gamificationRoutes);
router.use("/links", linkRoutes);
router.use("/", catalogRoutes);
