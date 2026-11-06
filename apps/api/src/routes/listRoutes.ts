import { Router } from "express";
import {
  addItemController,
  createListController,
  deleteItemController,
  deleteListController,
  getListController,
  listMineController,
  reorderItemsController,
  updateItemController,
  updateListController,
} from "../controllers/listController";
import { createCommentController, deleteCommentController, listCommentsController } from "../controllers/commentController";
import { discoverController, forkListController, toggleLikeController } from "../controllers/collectiveController";
import { authMiddleware, optionalAuthMiddleware } from "../middlewares/authMiddleware";

// Rotas de listas/trilhas e seus itens.
export const listRoutes = Router();

listRoutes.get("/discover", optionalAuthMiddleware, discoverController);
listRoutes.get("/", authMiddleware, listMineController);
listRoutes.post("/", authMiddleware, createListController);
listRoutes.get("/:id", optionalAuthMiddleware, getListController);
listRoutes.put("/:id", authMiddleware, updateListController);
listRoutes.delete("/:id", authMiddleware, deleteListController);
listRoutes.post("/:id/fork", authMiddleware, forkListController);
listRoutes.post("/:id/like", authMiddleware, toggleLikeController);
listRoutes.get("/:id/comments", optionalAuthMiddleware, listCommentsController);
listRoutes.post("/:id/comments", authMiddleware, createCommentController);
listRoutes.delete("/:id/comments/:commentId", authMiddleware, deleteCommentController);
listRoutes.post("/:id/items", authMiddleware, addItemController);
listRoutes.put("/:id/items/:itemId", authMiddleware, updateItemController);
listRoutes.delete("/:id/items/:itemId", authMiddleware, deleteItemController);
listRoutes.put("/:id/reorder", authMiddleware, reorderItemsController);
