import type { Habit, Prisma } from "@prisma/client";
import { prisma } from "./prismaClient";

// Relações carregadas junto de cada hábito.
const habitInclude = {
  list: { select: { title: true } },
  logs: { orderBy: { date: "desc" } },
} satisfies Prisma.HabitInclude;

// Tipo de um hábito com as relações carregadas.
export type HabitWithLogs = Prisma.HabitGetPayload<{ include: typeof habitInclude }>;

// Repositório com as operações de banco relacionadas a hábitos e check-ins.
export const habitRepository = {
  // Lista os hábitos de um usuário, dos mais recentes para os mais antigos.
  findManyByUser(userId: string): Promise<HabitWithLogs[]> {
    return prisma.habit.findMany({
      where: { userId },
      include: habitInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  // Busca um hábito pelo identificador.
  findById(id: string): Promise<HabitWithLogs | null> {
    return prisma.habit.findUnique({ where: { id }, include: habitInclude });
  },

  // Cria um hábito.
  create(data: Prisma.HabitUncheckedCreateInput): Promise<HabitWithLogs> {
    return prisma.habit.create({ data, include: habitInclude });
  },

  // Atualiza um hábito.
  update(id: string, data: Prisma.HabitUpdateInput): Promise<HabitWithLogs> {
    return prisma.habit.update({ where: { id }, data, include: habitInclude });
  },

  // Remove um hábito e seus registros.
  delete(id: string): Promise<Habit> {
    return prisma.habit.delete({ where: { id } });
  },

  // Registra (ou atualiza) o check-in de um hábito em um dia.
  upsertLog(habitId: string, date: Date, status: string): Promise<unknown> {
    return prisma.habitLog.upsert({
      where: { habitId_date: { habitId, date } },
      update: { status },
      create: { habitId, date, status },
    });
  },

  // Remove o check-in de um hábito em um dia.
  deleteLog(habitId: string, date: Date): Promise<unknown> {
    return prisma.habitLog.deleteMany({ where: { habitId, date } });
  },
};
