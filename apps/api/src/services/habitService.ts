import type { CreateHabitRequest, HabitDto, UpdateHabitRequest } from "@mentalidade/shared";
import type { Prisma } from "@prisma/client";
import { habitRepository, type HabitWithLogs } from "../repositories/habitRepository";
import { listRepository } from "../repositories/listRepository";
import { gamificationService } from "./gamificationService";
import { AppError } from "../utils/AppError";
import { todayString, toDateOnly } from "../utils/dateHelper";
import { toHabitDto } from "../utils/habitMapper";

// Garante que o hábito existe e pertence ao usuário informado.
async function assertOwnership(habitId: string, userId: string): Promise<HabitWithLogs> {
  const habit = await habitRepository.findById(habitId);

  if (!habit) {
    throw new AppError("Hábito não encontrado.", 404);
  }
  if (habit.userId !== userId) {
    throw new AppError("Você não tem permissão para alterar este hábito.", 403);
  }

  return habit;
}

// Valida que a lista informada pertence ao usuário (quando houver vínculo).
async function assertListOwnership(listId: string | null | undefined, userId: string): Promise<void> {
  if (!listId) {
    return;
  }

  const list = await listRepository.findById(listId);
  if (!list) {
    throw new AppError("Lista não encontrada.", 404);
  }
  if (list.ownerId !== userId) {
    throw new AppError("Você só pode vincular hábitos às suas próprias listas.", 403);
  }
}

// Serviço responsável pelos hábitos e seus check-ins.
export const habitService = {
  // Lista os hábitos do usuário com estatísticas de acompanhamento.
  async list(userId: string): Promise<HabitDto[]> {
    const habits = await habitRepository.findManyByUser(userId);
    const today = todayString();
    return habits.map((habit) => toHabitDto(habit, today));
  },

  // Cria um hábito.
  async create(userId: string, input: CreateHabitRequest): Promise<HabitDto> {
    await assertListOwnership(input.listId, userId);

    const habit = await habitRepository.create({
      userId,
      name: input.name,
      frequency: input.frequency ?? "DAILY",
      reminderTime: input.reminderTime ?? null,
      listId: input.listId ?? null,
    });

    return toHabitDto(habit, todayString());
  },

  // Retorna um hábito do usuário.
  async getById(habitId: string, userId: string): Promise<HabitDto> {
    const habit = await assertOwnership(habitId, userId);
    return toHabitDto(habit, todayString());
  },

  // Atualiza um hábito existente.
  async update(habitId: string, userId: string, input: UpdateHabitRequest): Promise<HabitDto> {
    await assertOwnership(habitId, userId);

    if (input.listId !== undefined) {
      await assertListOwnership(input.listId, userId);
    }

    const data: Prisma.HabitUpdateInput = {};

    if (input.name !== undefined) {
      data.name = input.name;
    }
    if (input.frequency !== undefined) {
      data.frequency = input.frequency;
    }
    if (input.reminderTime !== undefined) {
      data.reminderTime = input.reminderTime;
    }
    if (input.listId !== undefined) {
      data.list = input.listId ? { connect: { id: input.listId } } : { disconnect: true };
    }

    const habit = await habitRepository.update(habitId, data);
    return toHabitDto(habit, todayString());
  },

  // Remove um hábito do usuário.
  async remove(habitId: string, userId: string): Promise<void> {
    await assertOwnership(habitId, userId);
    await habitRepository.delete(habitId);
  },

  // Registra o check-in do hábito em uma data.
  async checkin(habitId: string, userId: string, date?: string, status = "DONE"): Promise<HabitDto> {
    const habit = await assertOwnership(habitId, userId);
    const targetDate = toDateOnly(date ?? todayString());

    // Verifica se já havia check-in no dia para não conceder pontos duplicados.
    const alreadyLogged = habit.logs.some((log) => log.date.getTime() === targetDate.getTime());

    await habitRepository.upsertLog(habitId, targetDate, status);

    if (!alreadyLogged && status === "DONE") {
      await gamificationService.award(userId, "HABIT_CHECKIN", habitId);
    }

    return this.getById(habitId, userId);
  },

  // Remove o check-in do hábito em uma data.
  async removeCheckin(habitId: string, userId: string, date?: string): Promise<HabitDto> {
    await assertOwnership(habitId, userId);
    await habitRepository.deleteLog(habitId, toDateOnly(date ?? todayString()));
    return this.getById(habitId, userId);
  },
};
