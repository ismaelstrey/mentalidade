import type {
  AuthUser,
  JournalFeedItem,
  ListCard,
  PublicProfile,
  UpdateProfileRequest,
} from "@mentalidade/shared";
import type { Prisma } from "@prisma/client";
import { journalRepository } from "../repositories/journalRepository";
import { listRepository } from "../repositories/listRepository";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../utils/AppError";
import { toJournalFeedItem } from "../utils/journalMapper";
import { toListCard } from "../utils/listMapper";
import { toAuthUser, toPublicUser } from "../utils/userMapper";

// Serviço responsável pelos perfis de usuário.
export const userService = {
  // Retorna o perfil público de um usuário pelo nome de usuário.
  async getPublicProfile(username: string): Promise<PublicProfile> {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new AppError("Perfil não encontrado.", 404);
    }

    const [followers, following, lists] = await Promise.all([
      userRepository.countFollowers(user.id),
      userRepository.countFollowing(user.id),
      userRepository.countPublicLists(user.id),
    ]);

    return { user: toPublicUser(user), stats: { followers, following, lists } };
  },

  // Lista as listas públicas de um usuário (todas, quando é o próprio dono).
  async listPublicLists(username: string, requesterId?: string): Promise<ListCard[]> {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new AppError("Perfil não encontrado.", 404);
    }

    const isOwner = user.id === requesterId;
    const lists = await listRepository.findByOwner(user.id, isOwner ? undefined : "PUBLIC");

    return lists.map(toListCard);
  },

  // Lista as reflexões públicas de um usuário (todas, quando é o próprio dono).
  async listPublicJournal(username: string, requesterId?: string): Promise<JournalFeedItem[]> {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new AppError("Perfil não encontrado.", 404);
    }

    const isOwner = user.id === requesterId;
    const entries = isOwner
      ? await journalRepository.findManyByUser(user.id)
      : await journalRepository.findPublicByUser(user.id);

    return entries.map(toJournalFeedItem);
  },

  // Atualiza os dados de perfil do usuário autenticado.
  async updateProfile(userId: string, input: UpdateProfileRequest): Promise<AuthUser> {
    const data: Prisma.UserUpdateInput = {};

    if (input.name !== undefined) {
      data.name = input.name;
    }
    if (input.bio !== undefined) {
      data.bio = input.bio;
    }
    if (input.avatarUrl !== undefined) {
      data.avatarUrl = input.avatarUrl;
    }

    const user = await userRepository.update(userId, data);

    return toAuthUser(user);
  },
};
