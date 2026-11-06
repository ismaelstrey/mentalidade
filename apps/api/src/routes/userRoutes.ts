import { Router } from "express";
import {
  getFollowStateController,
  getPublicProfileController,
  listUserJournalController,
  listUserListsController,
  toggleFollowController,
  updateProfileController,
} from "../controllers/userController";
import { authMiddleware, optionalAuthMiddleware } from "../middlewares/authMiddleware";

// Rotas de perfis de usuário.
export const userRoutes = Router();

userRoutes.put("/me", authMiddleware, updateProfileController);
userRoutes.get("/:username/lists", optionalAuthMiddleware, listUserListsController);
userRoutes.get("/:username/journal", optionalAuthMiddleware, listUserJournalController);
userRoutes.get("/:username/follow", optionalAuthMiddleware, getFollowStateController);
userRoutes.post("/:username/follow", authMiddleware, toggleFollowController);
userRoutes.get("/:username", getPublicProfileController);
