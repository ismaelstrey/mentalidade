import type { Request, Response } from "express";
import { catalogService } from "../services/catalogService";

// Retorna o catálogo de temas.
export function listThemesController(_req: Request, res: Response): void {
  res.json({ data: catalogService.listThemes(), message: "ok" });
}

// Retorna as tags cadastradas.
export async function listTagsController(_req: Request, res: Response): Promise<void> {
  const tags = await catalogService.listTags();
  res.json({ data: tags, message: "ok" });
}
