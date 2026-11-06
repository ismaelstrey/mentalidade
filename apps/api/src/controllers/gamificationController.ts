import type { Request, Response } from "express";
import { gamificationService } from "../services/gamificationService";
import { AppError } from "../utils/AppError";

// Recupera o identificador do usuário autenticado.
function requireUserId(req: Request): string {
  const user = req.user;
  if (!user) {
    throw new AppError("Usuário não autenticado.", 401);
  }
  return user.id;
}

// Retorna as estatísticas de gamificação do usuário autenticado.
export async function getGamificationController(req: Request, res: Response): Promise<void> {
  const stats = await gamificationService.getStats(requireUserId(req));
  res.json({ data: stats, message: "ok" });
}

// Retorna o ranking de contribuição da comunidade.
export async function getRankingController(_req: Request, res: Response): Promise<void> {
  const ranking = await gamificationService.getRanking();
  res.json({ data: ranking, message: "ok" });
}

// Retorna o feed de atividades recentes.
export async function getFeedController(_req: Request, res: Response): Promise<void> {
  const feed = await gamificationService.getFeed();
  res.json({ data: feed, message: "ok" });
}
