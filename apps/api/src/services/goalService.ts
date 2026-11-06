import type {
  CreateGoalRequest,
  GoalDto,
  UpdateGoalRequest,
  UpdateMilestoneRequest,
} from "@mentalidade/shared";
import type { Prisma } from "@prisma/client";
import { goalRepository, type GoalWithMilestones } from "../repositories/goalRepository";
import { gamificationService } from "./gamificationService";
import { AppError } from "../utils/AppError";
import { toGoalDto } from "../utils/goalMapper";

// Garante que a meta existe e pertence ao usuário informado.
async function assertOwnership(goalId: string, userId: string): Promise<GoalWithMilestones> {
  const goal = await goalRepository.findById(goalId);

  if (!goal) {
    throw new AppError("Meta não encontrada.", 404);
  }
  if (goal.userId !== userId) {
    throw new AppError("Você não tem permissão para alterar esta meta.", 403);
  }

  return goal;
}

// Recalcula o progresso da meta a partir dos marcos concluídos.
async function recomputeProgress(goalId: string): Promise<void> {
  const [total, done] = await Promise.all([
    goalRepository.countMilestones(goalId),
    goalRepository.countDoneMilestones(goalId),
  ]);

  // Sem marcos, o progresso é definido manualmente pelo usuário.
  if (total === 0) {
    return;
  }

  await goalRepository.update(goalId, { progress: Math.round((done / total) * 100) });
}

// Serviço responsável pelas metas e seus marcos.
export const goalService = {
  // Lista as metas do usuário.
  async list(userId: string): Promise<GoalDto[]> {
    const goals = await goalRepository.findManyByUser(userId);
    return goals.map(toGoalDto);
  },

  // Cria uma meta com marcos opcionais.
  async create(userId: string, input: CreateGoalRequest): Promise<GoalDto> {
    const milestones = input.milestones ?? [];

    const data: Prisma.GoalCreateInput = {
      title: input.title,
      description: input.description ?? null,
      targetDate: input.targetDate ? new Date(input.targetDate) : null,
      user: { connect: { id: userId } },
    };

    if (milestones.length > 0) {
      data.milestones = {
        create: milestones.map((title, index) => ({ title, order: index })),
      };
    }

    const goal = await goalRepository.create(data);
    return toGoalDto(goal);
  },

  // Retorna uma meta do usuário.
  async getById(goalId: string, userId: string): Promise<GoalDto> {
    const goal = await assertOwnership(goalId, userId);
    return toGoalDto(goal);
  },

  // Atualiza uma meta existente.
  async update(goalId: string, userId: string, input: UpdateGoalRequest): Promise<GoalDto> {
    const existing = await assertOwnership(goalId, userId);

    const data: Prisma.GoalUpdateInput = {};

    if (input.title !== undefined) {
      data.title = input.title;
    }
    if (input.description !== undefined) {
      data.description = input.description;
    }
    if (input.targetDate !== undefined) {
      data.targetDate = input.targetDate ? new Date(input.targetDate) : null;
    }
    if (input.status !== undefined) {
      data.status = input.status;
      // Concluir a meta leva o progresso a 100%.
      if (input.status === "DONE") {
        data.progress = 100;
      }
    }
    if (input.progress !== undefined) {
      data.progress = input.progress;
    }

    const goal = await goalRepository.update(goalId, data);

    // Concede os pontos quando a meta passa a concluída.
    if (input.status === "DONE" && existing.status !== "DONE") {
      await gamificationService.award(userId, "GOAL_DONE", goalId);
    }

    // Ao reativar ou arquivar, o progresso volta a refletir os marcos concluídos.
    if (input.status !== undefined && input.status !== "DONE" && input.progress === undefined) {
      await recomputeProgress(goalId);
      return this.getById(goalId, userId);
    }

    return toGoalDto(goal);
  },

  // Remove uma meta do usuário.
  async remove(goalId: string, userId: string): Promise<void> {
    await assertOwnership(goalId, userId);
    await goalRepository.delete(goalId);
  },

  // Adiciona um marco à meta e recalcula o progresso.
  async addMilestone(goalId: string, userId: string, title: string): Promise<GoalDto> {
    await assertOwnership(goalId, userId);

    const total = await goalRepository.countMilestonesForOrder(goalId);
    await goalRepository.addMilestone({ goalId, title, order: total });
    await recomputeProgress(goalId);

    return this.getById(goalId, userId);
  },

  // Atualiza um marco da meta e recalcula o progresso.
  async updateMilestone(
    goalId: string,
    userId: string,
    milestoneId: string,
    input: UpdateMilestoneRequest,
  ): Promise<GoalDto> {
    await assertOwnership(goalId, userId);
    await assertMilestoneBelongs(goalId, milestoneId);

    const data: Prisma.GoalMilestoneUpdateInput = {};
    if (input.title !== undefined) {
      data.title = input.title;
    }
    if (input.done !== undefined) {
      data.done = input.done;
    }

    await goalRepository.updateMilestone(milestoneId, data);
    await recomputeProgress(goalId);

    return this.getById(goalId, userId);
  },

  // Remove um marco da meta e recalcula o progresso.
  async removeMilestone(goalId: string, userId: string, milestoneId: string): Promise<GoalDto> {
    await assertOwnership(goalId, userId);
    await assertMilestoneBelongs(goalId, milestoneId);

    await goalRepository.deleteMilestone(milestoneId);
    await recomputeProgress(goalId);

    return this.getById(goalId, userId);
  },
};

// Garante que o marco existe e pertence à meta informada.
async function assertMilestoneBelongs(goalId: string, milestoneId: string): Promise<void> {
  const milestone = await goalRepository.findMilestone(milestoneId);

  if (!milestone || milestone.goalId !== goalId) {
    throw new AppError("Marco não encontrado nesta meta.", 404);
  }
}
