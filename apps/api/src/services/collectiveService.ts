import type { CommentDto, DiscoverQuery, LikeState, ListCard, ListDetail } from "@mentalidade/shared";
import type { Prisma } from "@prisma/client";
import { interactionRepository } from "../repositories/interactionRepository";
import { listRepository, type ListWithRelations } from "../repositories/listRepository";
import { gamificationService } from "./gamificationService";
import { AppError } from "../utils/AppError";
import { toCommentDto, toListCard, toListDetail } from "../utils/listMapper";
import { generateSlug } from "../utils/slug";
import { buildTags } from "../utils/tagHelper";

// Retorna a ordenação do Prisma conforme o critério escolhido.
function orderFor(sort: DiscoverQuery["sort"]): Prisma.ListOrderByWithRelationInput[] {
  switch (sort) {
    case "recent":
      return [{ createdAt: "desc" }];
    case "likes":
      return [{ likeCount: "desc" }, { createdAt: "desc" }];
    case "views":
      return [{ viewCount: "desc" }, { createdAt: "desc" }];
    default:
      return [{ importCount: "desc" }, { likeCount: "desc" }, { createdAt: "desc" }];
  }
}

// Garante que a lista existe e pode ser acessada pelo usuário informado.
async function getVisibleList(listId: string, requesterId?: string): Promise<ListWithRelations> {
  const list = await listRepository.findById(listId);

  if (!list) {
    throw new AppError("Lista não encontrada.", 404);
  }
  if (list.visibility === "PRIVATE" && list.ownerId !== requesterId) {
    throw new AppError("Esta lista é privada.", 403);
  }

  return list;
}

// Serviço com as ações coletivas: importar listas, curtir e comentar.
export const collectiveService = {
  // Importa (fork) uma lista pública para o acervo do usuário.
  async fork(sourceId: string, userId: string): Promise<ListDetail> {
    const source = await getVisibleList(sourceId, userId);

    const data: Prisma.ListCreateInput = {
      title: source.title,
      slug: generateSlug(source.title),
      description: source.description,
      theme: source.theme,
      visibility: "PUBLIC",
      owner: { connect: { id: userId } },
      tags: buildTags(source.tags.map((tag) => tag.name)),
    };

    if (source.items.length > 0) {
      data.items = {
        create: source.items.map((item, index) => ({
          url: item.url,
          title: item.title,
          platform: item.platform,
          note: item.note,
          order: index,
        })),
      };
    }

    const list = await listRepository.create(data);
    await interactionRepository.recordFork(sourceId, list.id, userId);
    // Concede os pontos por importar uma trilha da comunidade.
    await gamificationService.award(userId, "IMPORT_LIST", list.id);

    return toListDetail(list);
  },

  // Alterna a curtida do usuário em uma lista.
  async toggleLike(listId: string, userId: string): Promise<LikeState> {
    await getVisibleList(listId, userId);

    const existing = await interactionRepository.findLike(userId, "LIST", listId);

    if (existing) {
      await interactionRepository.deleteLike(existing.id);
      const updated = await listRepository.decrementLikeCount(listId);
      return { liked: false, likeCount: updated.likeCount };
    }

    await interactionRepository.createLike(userId, "LIST", listId);
    const updated = await listRepository.incrementLikeCount(listId);
    return { liked: true, likeCount: updated.likeCount };
  },

  // Lista os comentários de uma lista.
  async listComments(listId: string, requesterId?: string): Promise<CommentDto[]> {
    await getVisibleList(listId, requesterId);
    const comments = await interactionRepository.listComments(listId);
    return comments.map(toCommentDto);
  },

  // Adiciona um comentário a uma lista.
  async addComment(listId: string, userId: string, content: string): Promise<CommentDto> {
    await getVisibleList(listId, userId);
    const comment = await interactionRepository.createComment(userId, listId, content);
    return toCommentDto(comment);
  },

  // Remove um comentário (autor do comentário ou dono da lista).
  async removeComment(listId: string, userId: string, commentId: string): Promise<void> {
    const list = await getVisibleList(listId, userId);
    const comment = await interactionRepository.findComment(commentId);

    if (!comment || comment.listId !== listId) {
      throw new AppError("Comentário não encontrado.", 404);
    }
    if (comment.userId !== userId && list.ownerId !== userId) {
      throw new AppError("Você não tem permissão para remover este comentário.", 403);
    }

    await interactionRepository.deleteComment(commentId);
  },

  // Busca listas públicas com filtros, ordenação e paginação.
  async discover(query: DiscoverQuery): Promise<{ items: ListCard[]; total: number; page: number; perPage: number }> {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 12;

    const where: Prisma.ListWhereInput = { visibility: "PUBLIC" };

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: "insensitive" } },
        { description: { contains: query.q, mode: "insensitive" } },
      ];
    }
    if (query.theme) {
      where.theme = query.theme;
    }
    if (query.tag) {
      where.tags = { some: { name: query.tag } };
    }
    if (query.platform) {
      where.items = { some: { platform: query.platform } };
    }

    const { items, total } = await listRepository.searchPublic({
      where,
      orderBy: orderFor(query.sort),
      skip: (page - 1) * perPage,
      take: perPage,
    });

    return { items: items.map(toListCard), total, page, perPage };
  },
};
