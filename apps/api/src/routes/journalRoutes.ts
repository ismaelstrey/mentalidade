import { Router } from "express";
import {
  createJournalController,
  deleteJournalController,
  getJournalController,
  listJournalController,
  updateJournalController,
} from "../controllers/journalController";
import { authMiddleware } from "../middlewares/authMiddleware";

// Rotas do diário de reflexões.
export const journalRoutes = Router();

journalRoutes.get("/", authMiddleware, listJournalController);
journalRoutes.post("/", authMiddleware, createJournalController);
journalRoutes.get("/:id", authMiddleware, getJournalController);
journalRoutes.put("/:id", authMiddleware, updateJournalController);
journalRoutes.delete("/:id", authMiddleware, deleteJournalController);
