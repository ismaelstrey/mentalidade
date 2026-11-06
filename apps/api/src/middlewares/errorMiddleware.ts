import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";

// Middleware para rotas não encontradas.
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: true,
    message: `Rota não encontrada: ${req.originalUrl}`,
    statusCode: 404,
  });
}

// Middleware global de tratamento de erros.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: true, message: "Dados inválidos.", statusCode: 400 });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: true, message: err.message, statusCode: err.statusCode });
    return;
  }

  console.error(err);
  res.status(500).json({ error: true, message: "Erro interno do servidor.", statusCode: 500 });
}
