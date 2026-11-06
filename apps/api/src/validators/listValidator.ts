import { z } from "zod";

// Plataformas aceitas nos itens de lista.
export const platformSchema = z.enum(["YOUTUBE", "FACEBOOK", "INSTAGRAM", "TIKTOK", "OUTRO"]);

// Visibilidades aceitas nas listas.
const visibilitySchema = z.enum(["PRIVATE", "PUBLIC", "UNLISTED"]);

// Regras de validação de um item de lista.
const listItemSchema = z.object({
  url: z.url("Informe uma URL válida."),
  title: z.string().trim().min(1, "Informe um título.").max(200, "O título deve ter no máximo 200 caracteres."),
  platform: platformSchema,
  note: z.string().trim().max(500, "A observação deve ter no máximo 500 caracteres.").nullish(),
});

// Regras de validação da criação de lista.
export const createListSchema = z.object({
  title: z.string().trim().min(1, "Informe um título.").max(120, "O título deve ter no máximo 120 caracteres."),
  description: z.string().trim().max(1000, "A descrição deve ter no máximo 1000 caracteres.").nullish(),
  theme: z.string().trim().max(60, "O tema deve ter no máximo 60 caracteres.").nullish(),
  visibility: visibilitySchema.default("PUBLIC"),
  tags: z.array(z.string().trim().min(1).max(40)).max(10, "Use no máximo 10 tags.").optional(),
  items: z.array(listItemSchema).max(100, "A lista aceita no máximo 100 itens.").optional(),
});

// Dados esperados na criação de lista.
export type CreateListInput = z.infer<typeof createListSchema>;

// Regras de validação da edição de lista.
export const updateListSchema = z.object({
  title: z.string().trim().min(1, "Informe um título.").max(120, "O título deve ter no máximo 120 caracteres.").optional(),
  description: z.string().trim().max(1000, "A descrição deve ter no máximo 1000 caracteres.").nullish(),
  theme: z.string().trim().max(60, "O tema deve ter no máximo 60 caracteres.").nullish(),
  visibility: visibilitySchema.optional(),
  tags: z.array(z.string().trim().min(1).max(40)).max(10, "Use no máximo 10 tags.").optional(),
});

// Dados esperados na edição de lista.
export type UpdateListInput = z.infer<typeof updateListSchema>;

// Regras de validação de um item informado isoladamente.
export const listItemBodySchema = listItemSchema;

// Dados esperados ao criar/editar um item.
export type ListItemBodyInput = z.infer<typeof listItemSchema>;

// Regras de validação da reordenação de itens.
export const reorderSchema = z.object({
  itemIds: z.array(z.string().min(1)).min(1, "Informe ao menos um item."),
});

// Dados esperados na reordenação.
export type ReorderInput = z.infer<typeof reorderSchema>;
