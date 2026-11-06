import type { Request, Response } from "express";
import { linkPreviewService } from "../services/linkPreviewService";
import { previewSchema } from "../validators/linkValidator";

// Detecta plataforma e metadados de um link de vídeo.
export async function previewController(req: Request, res: Response): Promise<void> {
  const input = previewSchema.parse(req.body);
  const preview = await linkPreviewService.preview(input.url);

  res.json({ data: preview, message: "ok" });
}
