import { z } from "zod";

// Regras de validação da criação de um comentário.
export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Escreva um comentário.")
    .max(1000, "O comentário deve ter no máximo 1000 caracteres."),
});

// Dados esperados na criação de um comentário.
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
