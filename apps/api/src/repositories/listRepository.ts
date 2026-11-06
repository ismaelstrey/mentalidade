import type { Prisma } from "@prisma/client";
import { prisma } from "./prismaClient";

// Relações carregadas junto de cada lista.
const listInclude = {
  owner: true,
  tags: true,
  items: { orderBy: { order: "asc" } },
  _count: { select: { items: true } },
} satisfies Prisma.ListInclude;

// Tipo de uma lista com as relações carregadas.
export type ListWithRelations = Prisma.ListGetPayload<{ include: typeof listInclude }>;

// Repositório com as operações de banco relacionadas a listas e seus itens.
export const listRepository = {
  // Cria uma lista.
  create(data: Prisma.ListCreateInput): Promise<ListWithRelations> {
    return prisma.list.create({ data, include: listInclude });
  },

  // Busca uma lista pelo identificador.
  findById(id: string): Promise<ListWithRelations | null> {
    return prisma.list.findUnique({ where: { id }, include: listInclude });
  },

  // Lista as listas de um usuário, das mais recentes para as mais antigas.
  findByOwner(ownerId: string, visibility?: string): Promise<ListWithRelations[]> {
    return prisma.list.findMany({
      where: { ownerId, ...(visibility ? { visibility } : {}) },
      include: listInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  // Busca listas públicas aplicando filtros, ordenação e paginação.
  async searchPublic(params: {
    where: Prisma.ListWhereInput;
    orderBy: Prisma.ListOrderByWithRelationInput[];
    skip: number;
    take: number;
  }): Promise<{ items: ListWithRelations[]; total: number }> {
    const [items, total] = await prisma.$transaction([
      prisma.list.findMany({
        where: params.where,
        include: listInclude,
        orderBy: params.orderBy,
        skip: params.skip,
        take: params.take,
      }),
      prisma.list.count({ where: params.where }),
    ]);

    return { items, total };
  },

  // Atualiza uma lista.
  update(id: string, data: Prisma.ListUpdateInput): Promise<ListWithRelations> {
    return prisma.list.update({ where: { id }, data, include: listInclude });
  },

  // Remove uma lista.
  delete(id: string): Promise<unknown> {
    return prisma.list.delete({ where: { id } });
  },

  // Conta quantos itens a lista possui.
  countItems(listId: string): Promise<number> {
    return prisma.listItem.count({ where: { listId } });
  },

  // Adiciona um item à lista.
  addItem(data: Prisma.ListItemUncheckedCreateInput): Promise<unknown> {
    return prisma.listItem.create({ data });
  },

  // Busca um item pelo identificador.
  findItem(itemId: string) {
    return prisma.listItem.findUnique({ where: { id: itemId } });
  },

  // Atualiza um item da lista.
  updateItem(itemId: string, data: Prisma.ListItemUpdateInput): Promise<unknown> {
    return prisma.listItem.update({ where: { id: itemId }, data });
  },

  // Remove um item da lista.
  deleteItem(itemId: string): Promise<unknown> {
    return prisma.listItem.delete({ where: { id: itemId } });
  },

  // Aplica uma nova ordem a vários itens em uma única transação.
  updateItemsOrder(items: { id: string; order: number }[]): Promise<unknown[]> {
    return prisma.$transaction(
      items.map((item) => prisma.listItem.update({ where: { id: item.id }, data: { order: item.order } })),
    );
  },

  // Incrementa o contador de curtidas da lista.
  incrementLikeCount(id: string): Promise<ListWithRelations> {
    return prisma.list.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
      include: listInclude,
    });
  },

  // Decrementa o contador de curtidas da lista.
  decrementLikeCount(id: string): Promise<ListWithRelations> {
    return prisma.list.update({
      where: { id },
      data: { likeCount: { decrement: 1 } },
      include: listInclude,
    });
  },

  // Incrementa o contador de visualizações da lista.
  incrementViewCount(id: string): Promise<unknown> {
    return prisma.list.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  },

  // Lista as tags cadastradas com a quantidade de listas associadas.
  async listTagsWithCount(): Promise<{ name: string; count: number }[]> {
    const tags = await prisma.tag.findMany({
      select: { name: true, _count: { select: { lists: true } } },
      orderBy: { name: "asc" },
    });

    return tags.map((tag) => ({ name: tag.name, count: tag._count.lists }));
  },
};
