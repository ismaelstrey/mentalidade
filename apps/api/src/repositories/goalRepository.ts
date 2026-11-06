import type { Goal, GoalMilestone, Prisma } from "@prisma/client";
import { prisma } from "./prismaClient";

// Relações carregadas junto de cada meta.
const goalInclude = {
  milestones: { orderBy: { order: "asc" } },
} satisfies Prisma.GoalInclude;

// Tipo de uma meta com os marcos carregados.
export type GoalWithMilestones = Prisma.GoalGetPayload<{ include: typeof goalInclude }>;

// Repositório com as operações de banco relacionadas a metas e seus marcos.
export const goalRepository = {
  // Lista as metas de um usuário, das mais próximas do prazo para as demais.
  findManyByUser(userId: string): Promise<GoalWithMilestones[]> {
    return prisma.goal.findMany({
      where: { userId },
      include: goalInclude,
      orderBy: [{ targetDate: "asc" }, { title: "asc" }],
    });
  },

  // Busca uma meta pelo identificador.
  findById(id: string): Promise<GoalWithMilestones | null> {
    return prisma.goal.findUnique({ where: { id }, include: goalInclude });
  },

  // Cria uma meta.
  create(data: Prisma.GoalCreateInput): Promise<GoalWithMilestones> {
    return prisma.goal.create({ data, include: goalInclude });
  },

  // Atualiza uma meta.
  update(id: string, data: Prisma.GoalUpdateInput): Promise<GoalWithMilestones> {
    return prisma.goal.update({ where: { id }, data, include: goalInclude });
  },

  // Remove uma meta e seus marcos.
  delete(id: string): Promise<Goal> {
    return prisma.goal.delete({ where: { id } });
  },

  // Conta quantos marcos a meta possui.
  countMilestones(goalId: string): Promise<number> {
    return prisma.goalMilestone.count({ where: { goalId } });
  },

  // Conta quantos marcos da meta estão concluídos.
  countDoneMilestones(goalId: string): Promise<number> {
    return prisma.goalMilestone.count({ where: { goalId, done: true } });
  },

  // Busca um marco pelo identificador.
  findMilestone(id: string): Promise<GoalMilestone | null> {
    return prisma.goalMilestone.findUnique({ where: { id } });
  },

  // Conta os marcos já cadastrados para definir a ordem do próximo.
  countMilestonesForOrder(goalId: string): Promise<number> {
    return prisma.goalMilestone.count({ where: { goalId } });
  },

  // Adiciona um marco à meta.
  addMilestone(data: Prisma.GoalMilestoneUncheckedCreateInput): Promise<GoalMilestone> {
    return prisma.goalMilestone.create({ data });
  },

  // Atualiza um marco da meta.
  updateMilestone(id: string, data: Prisma.GoalMilestoneUpdateInput): Promise<GoalMilestone> {
    return prisma.goalMilestone.update({ where: { id }, data });
  },

  // Remove um marco da meta.
  deleteMilestone(id: string): Promise<GoalMilestone> {
    return prisma.goalMilestone.delete({ where: { id } });
  },
};
