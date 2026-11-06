import { z } from "zod";

// Frequências aceitas nos hábitos.
const frequencySchema = z.enum(["DAILY", "WEEKLY"]);

// Status aceitos no check-in de um hábito.
const statusSchema = z.enum(["DONE", "SKIPPED"]);

// Formato de data esperado (AAAA-MM-DD).
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data no formato AAAA-MM-DD.");

// Formato de horário esperado (HH:MM).
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Informe o horário no formato HH:MM.");

// Regras de validação da criação de hábito.
export const createHabitSchema = z.object({
  name: z.string().trim().min(1, "Informe um nome.").max(80, "O nome deve ter no máximo 80 caracteres."),
  frequency: frequencySchema.default("DAILY"),
  reminderTime: timeSchema.nullish(),
  listId: z.string().min(1).nullish(),
});

// Dados esperados na criação de hábito.
export type CreateHabitInput = z.infer<typeof createHabitSchema>;

// Regras de validação da edição de hábito.
export const updateHabitSchema = z.object({
  name: z.string().trim().min(1, "Informe um nome.").max(80, "O nome deve ter no máximo 80 caracteres.").optional(),
  frequency: frequencySchema.optional(),
  reminderTime: timeSchema.nullish(),
  listId: z.string().min(1).nullish(),
});

// Dados esperados na edição de hábito.
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;

// Regras de validação do check-in de hábito.
export const checkinSchema = z.object({
  date: dateSchema.optional(),
  status: statusSchema.default("DONE"),
});

// Dados esperados no check-in.
export type CheckinInput = z.infer<typeof checkinSchema>;

// Regras de validação da remoção de check-in.
export const removeCheckinSchema = z.object({
  date: dateSchema.optional(),
});

// Dados esperados na remoção de check-in.
export type RemoveCheckinInput = z.infer<typeof removeCheckinSchema>;
