import type { Request, Response } from "express";
import { journalService } from "../services/journalService";
import { AppError } from "../utils/AppError";
import { createJournalSchema, updateJournalSchema } from "../validators/journalValidator";

// Recupera o identificador do usuário autenticado.
function requireUserId(req: Request): string {
  const user = req.user;
  if (!user) {
    throw new AppError("Usuário não autenticado.", 401);
  }
  return user.id;
}

// Lista as entradas do diário do usuário autenticado.
export async function listJournalController(req: Request, res: Response): Promise<void> {
  const entries = await journalService.list(requireUserId(req));
  res.json({ data: entries, message: "ok" });
}

// Cria uma nova entrada do diário.
export async function createJournalController(req: Request, res: Response): Promise<void> {
  const input = createJournalSchema.parse(req.body);
  const entry = await journalService.create(requireUserId(req), input);
  res.status(201).json({ data: entry, message: "Reflexão registrada com sucesso." });
}

// Retorna uma entrada do diário do usuário.
export async function getJournalController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const entry = await journalService.getById(req.params.id, requireUserId(req));
  res.json({ data: entry, message: "ok" });
}

// Atualiza uma entrada do diário existente.
export async function updateJournalController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const input = updateJournalSchema.parse(req.body);
  const entry = await journalService.update(req.params.id, requireUserId(req), input);
  res.json({ data: entry, message: "Reflexão atualizada com sucesso." });
}

// Remove uma entrada do diário.
export async function deleteJournalController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  await journalService.remove(req.params.id, requireUserId(req));
  res.json({ data: null, message: "Reflexão removida com sucesso." });
}
