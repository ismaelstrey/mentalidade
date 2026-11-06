import type { FollowState } from "@mentalidade/shared";
import type { User } from "@prisma/client";
import { followRepository } from "../repositories/followRepository";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../utils/AppError";

// Busca o usuário alvo pelo nome de usuário, garantindo que ele existe.
async function resolveTarget(username: string): Promise<User> {
  const user = await userRepository.findByUsername(username);

  if (!user) {
    throw new AppError("Perfil não encontrado.", 404);
  }

  return user;
}

// Serviço responsável por seguir e deixar de seguir usuários.
export const followService = {
  // Alterna o seguimento do usuário atual sobre outro perfil.
  async toggleFollow(username: string, currentUserId: string): Promise<FollowState> {
    const target = await resolveTarget(username);

    if (target.id === currentUserId) {
      throw new AppError("Você não pode seguir a si mesmo.", 400);
    }

    const existing = await followRepository.find(currentUserId, target.id);

    if (existing) {
      await followRepository.delete(existing.id);
    } else {
      await followRepository.create(currentUserId, target.id);
    }

    const followers = await userRepository.countFollowers(target.id);

    return { following: !existing, followers };
  },

  // Retorna o estado de seguimento do usuário atual sobre outro perfil.
  async getState(username: string, currentUserId?: string): Promise<FollowState> {
    const target = await resolveTarget(username);

    const following = currentUserId
      ? Boolean(await followRepository.find(currentUserId, target.id))
      : false;
    const followers = await userRepository.countFollowers(target.id);

    return { following, followers };
  },
};
