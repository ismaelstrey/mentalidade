import type { Request, Response } from "express";
import { followService } from "../services/followService";
import { userService } from "../services/userService";
import { AppError } from "../utils/AppError";
import { updateProfileSchema } from "../validators/authValidator";

// Recupera o identificador do usuário autenticado.
function requireUserId(req: Request): string {
  const user = req.user;
  if (!user) {
    throw new AppError("Usuário não autenticado.", 401);
  }
  return user.id;
}

// Retorna o perfil público de um usuário pelo nome de usuário.
export async function getPublicProfileController(
  req: Request<{ username: string }>,
  res: Response,
): Promise<void> {
  const profile = await userService.getPublicProfile(req.params.username);

  res.json({ data: profile, message: "ok" });
}

// Lista as listas públicas de um usuário.
export async function listUserListsController(
  req: Request<{ username: string }>,
  res: Response,
): Promise<void> {
  const lists = await userService.listPublicLists(req.params.username, req.user?.id);

  res.json({ data: lists, message: "ok" });
}

// Lista as reflexões públicas do diário de um usuário.
export async function listUserJournalController(
  req: Request<{ username: string }>,
  res: Response,
): Promise<void> {
  const entries = await userService.listPublicJournal(req.params.username, req.user?.id);

  res.json({ data: entries, message: "ok" });
}

// Atualiza o perfil do usuário autenticado.
export async function updateProfileController(req: Request, res: Response): Promise<void> {
  const authenticatedUser = req.user;
  if (!authenticatedUser) {
    throw new AppError("Usuário não autenticado.", 401);
  }

  const input = updateProfileSchema.parse(req.body);
  const user = await userService.updateProfile(authenticatedUser.id, input);

  res.json({ data: user, message: "Perfil atualizado com sucesso." });
}

// Alterna o seguimento do usuário autenticado sobre outro perfil.
export async function toggleFollowController(
  req: Request<{ username: string }>,
  res: Response,
): Promise<void> {
  const state = await followService.toggleFollow(req.params.username, requireUserId(req));
  res.json({ data: state, message: "ok" });
}

// Retorna o estado de seguimento do usuário atual sobre um perfil.
export async function getFollowStateController(
  req: Request<{ username: string }>,
  res: Response,
): Promise<void> {
  const state = await followService.getState(req.params.username, req.user?.id);
  res.json({ data: state, message: "ok" });
}
