import { z } from "zod";

// Situações aceitas nas metas.
const statusSchema = z.enum(["ACTIVE", "DONE", "ARCHIVED"]);

// Valida uma data informada como texto (AAAA-MM-DD ou ISO).
const dateSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Informe uma data válida.");

// Regras de validação da criação de meta.
export const createGoalSchema = z.object({
  title: z.string().trim().min(1, "Informe um título.").max(120, "O título deve ter no máximo 120 caracteres."),
  description: z.string().trim().max(1000, "A descrição deve ter no máximo 1000 caracteres.").nullish(),
  targetDate: dateSchema.nullish(),
  milestones: z.array(z.string().trim().min(1).max(120)).max(50, "Use no máximo 50 marcos.").optional(),
});

// Dados esperados na criação de meta.
export type CreateGoalInput = z.infer<typeof createGoalSchema>;

// Regras de validação da edição de meta.
export const updateGoalSchema = z.object({
  title: z.string().trim().min(1, "Informe um título.").max(120, "O título deve ter no máximo 120 caracteres.").optional(),
  description: z.string().trim().max(1000, "A descrição deve ter no máximo 1000 caracteres.").nullish(),
  targetDate: dateSchema.nullish(),
  status: statusSchema.optional(),
  progress: z.coerce.number().int().min(0).max(100).optional(),
});

// Dados esperados na edição de meta.
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

// Regras de validação da criação de marco.
export const createMilestoneSchema = z.object({
  title: z.string().trim().min(1, "Informe um título.").max(120, "O título deve ter no máximo 120 caracteres."),
});

// Dados esperados na criação de marco.
export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;

// Regras de validação da edição de marco.
export const updateMilestoneSchema = z.object({
  title: z.string().trim().min(1, "Informe um título.").max(120, "O título deve ter no máximo 120 caracteres.").optional(),
  done: z.boolean().optional(),
});

// Dados esperados na edição de marco.
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
