import type { Prisma, User } from "@prisma/client";
import { prisma } from "./prismaClient";

// Repositório com as operações de banco relacionadas a usuários.
export const userRepository = {
  // Busca um usuário pelo e-mail.
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  // Busca um usuário pelo nome de usuário.
  findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  },

  // Busca um usuário pelo identificador.
  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  // Busca vários usuários por seus identificadores.
  findManyByIds(ids: string[]): Promise<User[]> {
    return prisma.user.findMany({ where: { id: { in: ids } } });
  },

  // Cria um novo usuário.
  create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  },

  // Atualiza os dados de um usuário.
  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },

  // Conta quantos seguidores o usuário possui.
  countFollowers(userId: string): Promise<number> {
    return prisma.follow.count({ where: { followingId: userId } });
  },

  // Conta quantos usuários este usuário segue.
  countFollowing(userId: string): Promise<number> {
    return prisma.follow.count({ where: { followerId: userId } });
  },

  // Conta quantas listas públicas o usuário possui.
  countPublicLists(userId: string): Promise<number> {
    return prisma.list.count({ where: { ownerId: userId, visibility: "PUBLIC" } });
  },
};
