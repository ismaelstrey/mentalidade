import { Router } from "express";
import {
  createHabitController,
  deleteHabitController,
  getHabitController,
  habitCheckinController,
  habitUncheckinController,
  listHabitsController,
  updateHabitController,
} from "../controllers/habitController";
import { authMiddleware } from "../middlewares/authMiddleware";

// Rotas de hábitos e check-ins diários.
export const habitRoutes = Router();

habitRoutes.get("/", authMiddleware, listHabitsController);
habitRoutes.post("/", authMiddleware, createHabitController);
habitRoutes.get("/:id", authMiddleware, getHabitController);
habitRoutes.put("/:id", authMiddleware, updateHabitController);
habitRoutes.delete("/:id", authMiddleware, deleteHabitController);
habitRoutes.post("/:id/checkin", authMiddleware, habitCheckinController);
habitRoutes.delete("/:id/checkin", authMiddleware, habitUncheckinController);
