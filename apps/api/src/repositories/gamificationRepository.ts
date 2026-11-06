import type { PointEvent, Prisma } from "@prisma/client";
import { prisma } from "./prismaClient";

// Tipo de evento de pontos com o autor carregado.
export type PointEventWithUser = Prisma.PointEventGetPayload<{ include: { user: true } }>;

// Repositório com as operações de banco da gamificação.
export const gamificationRepository = {
  // Registra um evento de pontos.
  create(data: Prisma.PointEventUncheckedCreateInput): Promise<PointEvent> {
    return prisma.pointEvent.create({ data });
  },

  // Soma a pontuação total de um usuário.
  async sumPoints(userId: string): Promise<number> {
    const result = await prisma.pointEvent.aggregate({
      where: { userId },
      _sum: { points: true },
    });
    return result._sum.points ?? 0;
  },

  // Agrupa a pontuação por usuário, do maior para o menor.
  groupPointsByUser(limit: number): Promise<{ userId: string; total: number }[]> {
    return prisma.pointEvent
      .groupBy({
        by: ["userId"],
        _sum: { points: true },
        orderBy: { _sum: { points: "desc" } },
        take: limit,
      })
      .then((rows) => rows.map((row) => ({ userId: row.userId, total: row._sum.points ?? 0 })));
  },

  // Lista os eventos recentes com o autor carregado.
  listRecent(limit: number): Promise<PointEventWithUser[]> {
    return prisma.pointEvent.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  // Conta as listas criadas por um usuário.
  countLists(userId: string): Promise<number> {
    return prisma.list.count({ where: { ownerId: userId } });
  },

  // Conta as listas importadas (fork) por um usuário.
  countForks(userId: string): Promise<number> {
    return prisma.fork.count({ where: { userId } });
  },

  // Conta os check-ins de hábito registrados por um usuário.
  countHabitCheckins(userId: string): Promise<number> {
    return prisma.habitLog.count({ where: { habit: { userId } } });
  },

  // Conta as metas concluídas por um usuário.
  countDoneGoals(userId: string): Promise<number> {
    return prisma.goal.count({ where: { userId, status: "DONE" } });
  },

  // Conta as reflexões escritas por um usuário.
  countJournalEntries(userId: string): Promise<number> {
    return prisma.journalEntry.count({ where: { userId } });
  },
};
