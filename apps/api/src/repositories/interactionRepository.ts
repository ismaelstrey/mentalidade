import type { Comment, Like, Prisma } from "@prisma/client";
import { prisma } from "./prismaClient";

// Tipo de comentário com o autor carregado.
export type CommentWithAuthor = Prisma.CommentGetPayload<{ include: { user: true } }>;

// Repositório com as interações coletivas: curtidas, comentários e importações.
export const interactionRepository = {
  // Busca a curtida de um usuário sobre um alvo específico.
  findLike(userId: string, targetType: string, targetId: string): Promise<Like | null> {
    return prisma.like.findUnique({
      where: { userId_targetType_targetId: { userId, targetType, targetId } },
    });
  },

  // Cria uma curtida.
  createLike(userId: string, targetType: string, targetId: string): Promise<Like> {
    return prisma.like.create({ data: { userId, targetType, targetId } });
  },

  // Remove uma curtida pelo identificador.
  deleteLike(id: string): Promise<Like> {
    return prisma.like.delete({ where: { id } });
  },

  // Lista os comentários de uma lista, dos mais antigos para os mais novos.
  listComments(listId: string): Promise<CommentWithAuthor[]> {
    return prisma.comment.findMany({
      where: { listId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });
  },

  // Busca um comentário pelo identificador.
  findComment(id: string): Promise<Comment | null> {
    return prisma.comment.findUnique({ where: { id } });
  },

  // Cria um comentário em uma lista.
  createComment(userId: string, listId: string, content: string): Promise<CommentWithAuthor> {
    return prisma.comment.create({
      data: { userId, listId, content },
      include: { user: true },
    });
  },

  // Remove um comentário.
  deleteComment(id: string): Promise<Comment> {
    return prisma.comment.delete({ where: { id } });
  },

  // Registra uma importação (fork) e incrementa o contador da lista de origem.
  recordFork(sourceListId: string, newListId: string, userId: string): Promise<unknown> {
    return prisma.$transaction([
      prisma.fork.create({ data: { sourceListId, newListId, userId } }),
      prisma.list.update({
        where: { id: sourceListId },
        data: { importCount: { increment: 1 } },
      }),
    ]);
  },
};
