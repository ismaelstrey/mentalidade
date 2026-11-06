import { z } from "zod";
import { platformSchema } from "./listValidator";

// Regras de validação da busca de listas públicas.
export const discoverQuerySchema = z.object({
  q: z.string().trim().max(120, "A busca deve ter no máximo 120 caracteres.").optional(),
  theme: z.string().trim().max(60, "O tema deve ter no máximo 60 caracteres.").optional(),
  tag: z.string().trim().max(40, "A tag deve ter no máximo 40 caracteres.").optional(),
  platform: platformSchema.optional(),
  sort: z.enum(["recent", "popular", "likes", "views"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  perPage: z.coerce.number().int().min(1).max(50, "Use no máximo 50 itens por página.").optional(),
});

// Dados esperados na busca de listas.
export type DiscoverInput = z.infer<typeof discoverQuerySchema>;
