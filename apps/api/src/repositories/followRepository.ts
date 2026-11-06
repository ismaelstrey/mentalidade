import type { Follow } from "@prisma/client";
import { prisma } from "./prismaClient";

// Repositório com as operações de banco relacionadas a seguir usuários.
export const followRepository = {
  // Busca a relação de seguimento entre dois usuários.
  find(followerId: string, followingId: string): Promise<Follow | null> {
    return prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });
  },

  // Cria a relação de seguimento.
  create(followerId: string, followingId: string): Promise<Follow> {
    return prisma.follow.create({ data: { followerId, followingId } });
  },

  // Remove a relação de seguimento pelo identificador.
  delete(id: string): Promise<Follow> {
    return prisma.follow.delete({ where: { id } });
  },
};
