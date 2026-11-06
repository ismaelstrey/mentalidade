import type { Theme } from "@mentalidade/shared";
import { listRepository } from "../repositories/listRepository";
import { themeCatalog } from "../utils/themeCatalog";

// Serviço responsável pelo catálogo de temas e tags.
export const catalogService = {
  // Retorna o catálogo fixo de temas.
  listThemes(): Theme[] {
    return themeCatalog;
  },

  // Retorna as tags cadastradas com a quantidade de listas associadas.
  listTags(): Promise<{ name: string; count: number }[]> {
    return listRepository.listTagsWithCount();
  },
};
