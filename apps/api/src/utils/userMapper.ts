import type { AuthUser, PublicUser, UserRole } from "@mentalidade/shared";
import type { User } from "@prisma/client";

// Converte o registro do banco para o formato público do usuário.
export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    role: user.role as UserRole,
    createdAt: user.createdAt.toISOString(),
  };
}

// Converte o registro do banco para o formato autenticado (inclui e-mail).
export function toAuthUser(user: User): AuthUser {
  return { ...toPublicUser(user), email: user.email };
}
