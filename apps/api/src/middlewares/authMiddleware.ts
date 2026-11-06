import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";

// Middleware que exige um token JWT válido e injeta o usuário na requisição.
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    next(new AppError("Token de autenticação não informado.", 401));
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, username: payload.username };
    next();
  } catch {
    next(new AppError("Token inválido ou expirado.", 401));
  }
}

// Middleware que injeta o usuário quando um token válido é enviado, sem exigir autenticação.
export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    const token = header.slice("Bearer ".length).trim();

    try {
      const payload = verifyToken(token);
      req.user = { id: payload.sub, username: payload.username };
    } catch {
      // Token inválido é simplesmente ignorado em rotas de acesso opcional.
    }
  }

  next();
}
