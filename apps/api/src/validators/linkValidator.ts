import { z } from "zod";

// Regras de validação da pré-visualização de link.
export const previewSchema = z.object({
  url: z.url("Informe uma URL válida."),
});

// Dados esperados na pré-visualização.
export type PreviewInput = z.infer<typeof previewSchema>;
