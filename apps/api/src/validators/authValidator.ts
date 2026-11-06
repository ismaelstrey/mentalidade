import { z } from "zod";

// Regras de validação do cadastro de usuários.
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome com ao menos 2 caracteres."),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "O usuário deve ter ao menos 3 caracteres.")
    .max(30, "O usuário deve ter no máximo 30 caracteres.")
    .regex(/^[a-z0-9_]+$/, "Use apenas letras minúsculas, números e underline."),
  email: z.email("Informe um e-mail válido.").toLowerCase(),
  password: z.string().min(8, "A senha deve ter ao menos 8 caracteres."),
});

// Dados esperados no cadastro.
export type RegisterInput = z.infer<typeof registerSchema>;

// Regras de validação do login.
export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido.").toLowerCase(),
  password: z.string().min(1, "Informe a senha."),
});

// Dados esperados no login.
export type LoginInput = z.infer<typeof loginSchema>;

// Regras de validação da atualização de perfil.
export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Informe um nome com ao menos 2 caracteres.").optional(),
  bio: z.string().trim().max(280, "A bio deve ter no máximo 280 caracteres.").nullish(),
  avatarUrl: z.url("Informe uma URL válida.").nullish(),
});

// Dados esperados na atualização de perfil.
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
