import type { Request, Response } from "express";
import { habitService } from "../services/habitService";
import { AppError } from "../utils/AppError";
import { checkinSchema, createHabitSchema, removeCheckinSchema, updateHabitSchema } from "../validators/habitValidator";

// Recupera o identificador do usuário autenticado.
function requireUserId(req: Request): string {
  const user = req.user;
  if (!user) {
    throw new AppError("Usuário não autenticado.", 401);
  }
  return user.id;
}

// Lista os hábitos do usuário autenticado.
export async function listHabitsController(req: Request, res: Response): Promise<void> {
  const habits = await habitService.list(requireUserId(req));
  res.json({ data: habits, message: "ok" });
}

// Cria um novo hábito.
export async function createHabitController(req: Request, res: Response): Promise<void> {
  const input = createHabitSchema.parse(req.body);
  const habit = await habitService.create(requireUserId(req), input);
  res.status(201).json({ data: habit, message: "Hábito criado com sucesso." });
}

// Retorna um hábito do usuário.
export async function getHabitController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const habit = await habitService.getById(req.params.id, requireUserId(req));
  res.json({ data: habit, message: "ok" });
}

// Atualiza um hábito existente.
export async function updateHabitController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const input = updateHabitSchema.parse(req.body);
  const habit = await habitService.update(req.params.id, requireUserId(req), input);
  res.json({ data: habit, message: "Hábito atualizado com sucesso." });
}

// Remove um hábito.
export async function deleteHabitController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  await habitService.remove(req.params.id, requireUserId(req));
  res.json({ data: null, message: "Hábito removido com sucesso." });
}

// Registra o check-in do hábito.
export async function habitCheckinController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const input = checkinSchema.parse(req.body ?? {});
  const habit = await habitService.checkin(req.params.id, requireUserId(req), input.date, input.status);
  res.status(201).json({ data: habit, message: "Check-in registrado." });
}

// Remove o check-in do hábito.
export async function habitUncheckinController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const input = removeCheckinSchema.parse(req.body ?? {});
  const habit = await habitService.removeCheckin(req.params.id, requireUserId(req), input.date);
  res.json({ data: habit, message: "Check-in removido." });
}
