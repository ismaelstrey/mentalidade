import type { HabitFrequency, HabitLogStatus, HabitDto, HabitLogDto } from "@mentalidade/shared";
import type { HabitWithLogs } from "../repositories/habitRepository";
import { shiftDate, toDateString } from "./dateHelper";

// Quantidade de dias exibidos no mapa de calor (heatmap).
const HEATMAP_DAYS = 30;

// Calcula a sequência de dias consecutivos concluídos até a data informada.
export function calculateStreak(doneDates: Set<string>, today: string): number {
  let cursor = today;

  // A sequência continua válida se o check-in de hoje ainda não foi feito.
  if (!doneDates.has(cursor)) {
    cursor = shiftDate(cursor, -1);
  }

  let streak = 0;
  while (doneDates.has(cursor)) {
    streak += 1;
    cursor = shiftDate(cursor, -1);
  }

  return streak;
}

// Converte o registro do banco para o formato de transporte, com estatísticas.
export function toHabitDto(habit: HabitWithLogs, today: string): HabitDto {
  const statusByDate = new Map<string, HabitLogStatus>();
  for (const log of habit.logs) {
    statusByDate.set(toDateString(log.date), log.status as HabitLogStatus);
  }

  const doneDates = new Set<string>();
  for (const [date, status] of statusByDate) {
    if (status === "DONE") {
      doneDates.add(date);
    }
  }

  // Monta o heatmap dos últimos dias, do mais antigo para o mais recente.
  const logs: HabitLogDto[] = [];
  for (let offset = HEATMAP_DAYS - 1; offset >= 0; offset -= 1) {
    const date = shiftDate(today, -offset);
    const status = statusByDate.get(date);
    if (status) {
      logs.push({ date, status });
    }
  }

  return {
    id: habit.id,
    name: habit.name,
    frequency: habit.frequency as HabitFrequency,
    reminderTime: habit.reminderTime,
    listId: habit.listId,
    listTitle: habit.list?.title ?? null,
    createdAt: habit.createdAt.toISOString(),
    streak: calculateStreak(doneDates, today),
    doneInPeriod: logs.filter((log) => log.status === "DONE").length,
    todayStatus: statusByDate.get(today) ?? null,
    logs,
  };
}
