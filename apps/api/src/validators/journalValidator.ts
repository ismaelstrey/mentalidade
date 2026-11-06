import { z } from "zod";

// Visibilidades aceitas nas entradas do diário.
const visibilitySchema = z.enum(["PRIVATE", "PUBLIC"]);

// Regras de validação da criação de uma entrada do diário.
export const createJournalSchema = z.object({
  title: z.string().trim().max(120, "O título deve ter no máximo 120 caracteres.").nullish(),
  content: z
    .string()
    .trim()
    .min(1, "Escreva sua reflexão.")
    .max(10000, "A reflexão deve ter no máximo 10000 caracteres."),
  mood: z.string().trim().max(30, "O humor deve ter no máximo 30 caracteres.").nullish(),
  visibility: visibilitySchema.optional(),
  listId: z.string().min(1).nullish(),
});

// Dados esperados na criação de uma entrada do diário.
export type CreateJournalInput = z.infer<typeof createJournalSchema>;

// Regras de validação da edição de uma entrada do diário.
export const updateJournalSchema = z.object({
  title: z.string().trim().max(120, "O título deve ter no máximo 120 caracteres.").nullish(),
  content: z
    .string()
    .trim()
    .min(1, "Escreva sua reflexão.")
    .max(10000, "A reflexão deve ter no máximo 10000 caracteres."),
  mood: z.string().trim().max(30, "O humor deve ter no máximo 30 caracteres.").nullish(),
  visibility: visibilitySchema.optional(),
  listId: z.string().min(1).nullish(),
});

// Dados esperados na edição de uma entrada do diário.
export type UpdateJournalInput = z.infer<typeof updateJournalSchema>;
