import type { Request, Response } from "express";
import { authService } from "../services/authService";
import { AppError } from "../utils/AppError";
import { loginSchema, registerSchema } from "../validators/authValidator";

// Cadastra um novo usuário e retorna o token de acesso.
export async function registerController(req: Request, res: Response): Promise<void> {
  const input = registerSchema.parse(req.body);
  const result = await authService.register(input);

  res.status(201).json({ data: result, message: "Usuário cadastrado com sucesso." });
}

// Autentica um usuário existente e retorna o token de acesso.
export async function loginController(req: Request, res: Response): Promise<void> {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);

  res.json({ data: result, message: "Login realizado com sucesso." });
}

// Retorna os dados do usuário autenticado.
export async function meController(req: Request, res: Response): Promise<void> {
  const authenticatedUser = req.user;
  if (!authenticatedUser) {
    throw new AppError("Usuário não autenticado.", 401);
  }

  const user = await authService.getAuthenticatedUser(authenticatedUser.id);

  res.json({ data: user, message: "ok" });
}
