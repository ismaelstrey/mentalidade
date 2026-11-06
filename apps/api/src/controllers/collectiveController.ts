import type { Request, Response } from "express";
import { collectiveService } from "../services/collectiveService";
import { AppError } from "../utils/AppError";
import { discoverQuerySchema } from "../validators/discoverValidator";

// Recupera o identificador do usuário autenticado.
function requireUserId(req: Request): string {
  const user = req.user;
  if (!user) {
    throw new AppError("Usuário não autenticado.", 401);
  }
  return user.id;
}

// Busca listas públicas com filtros e ordenação.
export async function discoverController(req: Request, res: Response): Promise<void> {
  const query = discoverQuerySchema.parse(req.query);
  const result = await collectiveService.discover(query);
  res.json({ data: result, message: "ok" });
}

// Importa (fork) uma lista para o acervo do usuário.
export async function forkListController(req: Request<{ id: string }>, res: Response): Promise<void> {
  const list = await collectiveService.fork(req.params.id, requireUserId(req));
  res.status(201).json({ data: list, message: "Lista importada com sucesso." });
}

// Alterna a curtida do usuário em uma lista.
export async function toggleLikeController(req: Request<{ id: string }>, res: Response): Promise<void> {
  const state = await collectiveService.toggleLike(req.params.id, requireUserId(req));
  res.json({ data: state, message: state.liked ? "Lista curtida." : "Curtida removida." });
}
