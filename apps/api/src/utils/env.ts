import "dotenv/config";
import { z } from "zod";

// Valida e expõe as variáveis de ambiente da aplicação.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3344),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória."),
  JWT_SECRET: z.string().min(16, "JWT_SECRET deve ter no mínimo 16 caracteres."),
  JWT_EXPIRES_IN: z.string().default("1d"),
  CORS_ORIGIN: z.string().default("http://localhost:5180"),
});

export const env = envSchema.parse(process.env);
