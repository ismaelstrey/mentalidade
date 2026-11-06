import { Router } from "express";
import {
  addMilestoneController,
  createGoalController,
  deleteGoalController,
  deleteMilestoneController,
  getGoalController,
  listGoalsController,
  updateGoalController,
  updateMilestoneController,
} from "../controllers/goalController";
import { authMiddleware } from "../middlewares/authMiddleware";

// Rotas de metas e seus marcos.
export const goalRoutes = Router();

goalRoutes.get("/", authMiddleware, listGoalsController);
goalRoutes.post("/", authMiddleware, createGoalController);
goalRoutes.get("/:id", authMiddleware, getGoalController);
goalRoutes.put("/:id", authMiddleware, updateGoalController);
goalRoutes.delete("/:id", authMiddleware, deleteGoalController);
goalRoutes.post("/:id/milestones", authMiddleware, addMilestoneController);
goalRoutes.put("/:id/milestones/:milestoneId", authMiddleware, updateMilestoneController);
goalRoutes.delete("/:id/milestones/:milestoneId", authMiddleware, deleteMilestoneController);
