import type { Request, Response } from "express";
import { goalService } from "../services/goalService";
import { AppError } from "../utils/AppError";
import {
  createGoalSchema,
  createMilestoneSchema,
  updateGoalSchema,
  updateMilestoneSchema,
} from "../validators/goalValidator";

// Recupera o identificador do usuário autenticado.
function requireUserId(req: Request): string {
  const user = req.user;
  if (!user) {
    throw new AppError("Usuário não autenticado.", 401);
  }
  return user.id;
}

// Lista as metas do usuário autenticado.
export async function listGoalsController(req: Request, res: Response): Promise<void> {
  const goals = await goalService.list(requireUserId(req));
  res.json({ data: goals, message: "ok" });
}

// Cria uma nova meta.
export async function createGoalController(req: Request, res: Response): Promise<void> {
  const input = createGoalSchema.parse(req.body);
  const goal = await goalService.create(requireUserId(req), input);
  res.status(201).json({ data: goal, message: "Meta criada com sucesso." });
}

// Retorna uma meta do usuário.
export async function getGoalController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const goal = await goalService.getById(req.params.id, requireUserId(req));
  res.json({ data: goal, message: "ok" });
}

// Atualiza uma meta existente.
export async function updateGoalController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const input = updateGoalSchema.parse(req.body);
  const goal = await goalService.update(req.params.id, requireUserId(req), input);
  res.json({ data: goal, message: "Meta atualizada com sucesso." });
}

// Remove uma meta.
export async function deleteGoalController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  await goalService.remove(req.params.id, requireUserId(req));
  res.json({ data: null, message: "Meta removida com sucesso." });
}

// Adiciona um marco à meta.
export async function addMilestoneController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const input = createMilestoneSchema.parse(req.body);
  const goal = await goalService.addMilestone(req.params.id, requireUserId(req), input.title);
  res.status(201).json({ data: goal, message: "Marco adicionado com sucesso." });
}

// Atualiza um marco da meta.
export async function updateMilestoneController(
  req: Request<{ id: string; milestoneId: string }>,
  res: Response,
): Promise<void> {
  const input = updateMilestoneSchema.parse(req.body);
  const goal = await goalService.updateMilestone(
    req.params.id,
    requireUserId(req),
    req.params.milestoneId,
    input,
  );
  res.json({ data: goal, message: "Marco atualizado com sucesso." });
}

// Remove um marco da meta.
export async function deleteMilestoneController(
  req: Request<{ id: string; milestoneId: string }>,
  res: Response,
): Promise<void> {
  const goal = await goalService.removeMilestone(req.params.id, requireUserId(req), req.params.milestoneId);
  res.json({ data: goal, message: "Marco removido com sucesso." });
}
