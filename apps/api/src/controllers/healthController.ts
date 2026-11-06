import type { Request, Response } from "express";
import { healthService } from "../services/healthService";

// Retorna o status de funcionamento da API.
export function healthController(_req: Request, res: Response): void {
  const status = healthService.getStatus();
  res.json({ data: status, message: "ok" });
}
