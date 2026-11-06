import type { Request, Response } from "express";
import { collectiveService } from "../services/collectiveService";
import { AppError } from "../utils/AppError";
import { createCommentSchema } from "../validators/commentValidator";

// Recupera o identificador do usuário autenticado.
function requireUserId(req: Request): string {
  const user = req.user;
  if (!user) {
    throw new AppError("Usuário não autenticado.", 401);
  }
  return user.id;
}

// Lista os comentários de uma lista.
export async function listCommentsController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const comments = await collectiveService.listComments(req.params.id, req.user?.id);
  res.json({ data: comments, message: "ok" });
}

// Adiciona um comentário à lista.
export async function createCommentController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const input = createCommentSchema.parse(req.body);
  const comment = await collectiveService.addComment(req.params.id, requireUserId(req), input.content);
  res.status(201).json({ data: comment, message: "Comentário publicado." });
}

// Remove um comentário da lista.
export async function deleteCommentController(
  req: Request<{ id: string; commentId: string }>,
  res: Response,
): Promise<void> {
  await collectiveService.removeComment(req.params.id, requireUserId(req), req.params.commentId);
  res.json({ data: null, message: "Comentário removido." });
}
