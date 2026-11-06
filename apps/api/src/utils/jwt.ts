import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "./env";

// Conteúdo codificado dentro do token JWT.
export interface TokenPayload {
  sub: string;
  username: string;
}

// Gera um token JWT assinado com os dados do usuário.
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
}

// Valida e decodifica um token JWT, retornando seu conteúdo.
export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  const sub: unknown = typeof decoded === "string" ? undefined : decoded.sub;
  const username: unknown = typeof decoded === "string" ? undefined : decoded.username;

  if (typeof sub !== "string" || typeof username !== "string") {
    throw new Error("Conteúdo do token inválido.");
  }

  return { sub, username };
}
