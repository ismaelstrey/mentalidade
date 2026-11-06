import type {
  CreateListRequest,
  ListDetail,
  ListItemRequest,
  ListSummary,
  ReorderItemsRequest,
  UpdateListRequest,
} from "@mentalidade/shared";
import type { Prisma } from "@prisma/client";
import { interactionRepository } from "../repositories/interactionRepository";
import { listRepository, type ListWithRelations } from "../repositories/listRepository";
import { gamificationService } from "./gamificationService";
import { AppError } from "../utils/AppError";
import { toListDetail, toListSummary } from "../utils/listMapper";
import { generateSlug } from "../utils/slug";
import { buildTags } from "../utils/tagHelper";

// Garante que a lista existe e pertence ao usuário informado.
async function assertOwnership(listId: string, userId: string): Promise<ListWithRelations> {
  const list = await listRepository.findById(listId);

  if (!list) {
    throw new AppError("Lista não encontrada.", 404);
  }
  if (list.ownerId !== userId) {
    throw new AppError("Você não tem permissão para alterar esta lista.", 403);
  }

  return list;
}

// Serviço responsável pelas listas/trilhas e seus itens.
export const listService = {
  // Lista as listas do usuário autenticado.
  async listMine(userId: string): Promise<ListSummary[]> {
    const lists = await listRepository.findByOwner(userId);
    return lists.map(toListSummary);
  },

  // Cria uma lista com itens e tags opcionais.
  async create(userId: string, input: CreateListRequest): Promise<ListDetail> {
    const items = input.items ?? [];

    const data: Prisma.ListCreateInput = {
      title: input.title,
      slug: generateSlug(input.title),
      description: input.description ?? null,
      theme: input.theme ?? null,
      visibility: input.visibility ?? "PUBLIC",
      owner: { connect: { id: userId } },
      tags: buildTags(input.tags ?? []),
    };

    if (items.length > 0) {
      data.items = {
        create: items.map((item, index) => ({
          url: item.url,
          title: item.title,
          platform: item.platform,
          note: item.note ?? null,
          order: index,
        })),
      };
    }

    const list = await listRepository.create(data);
    // Concede os pontos por criar uma trilha.
    await gamificationService.award(userId, "CREATE_LIST", list.id);
    return toListDetail(list);
  },

  // Retorna o detalhe de uma lista respeitando a visibilidade.
  async getById(listId: string, requesterId?: string): Promise<ListDetail> {
    const list = await listRepository.findById(listId);

    if (!list) {
      throw new AppError("Lista não encontrada.", 404);
    }
    if (list.visibility === "PRIVATE" && list.ownerId !== requesterId) {
      throw new AppError("Esta lista é privada.", 403);
    }

    // Contabiliza a visualização quando quem acessa não é o próprio dono.
    if (list.ownerId !== requesterId) {
      await listRepository.incrementViewCount(listId);
      list.viewCount += 1;
    }

    // Indica se o usuário atual já curtiu a lista.
    const liked = requesterId
      ? Boolean(await interactionRepository.findLike(requesterId, "LIST", listId))
      : false;

    return toListDetail(list, liked);
  },

  // Atualiza os dados de uma lista existente.
  async update(listId: string, userId: string, input: UpdateListRequest): Promise<ListDetail> {
    await assertOwnership(listId, userId);

    const data: Prisma.ListUpdateInput = {};

    if (input.title !== undefined) {
      data.title = input.title;
    }
    if (input.description !== undefined) {
      data.description = input.description;
    }
    if (input.theme !== undefined) {
      data.theme = input.theme;
    }
    if (input.visibility !== undefined) {
      data.visibility = input.visibility;
    }
    if (input.tags !== undefined) {
      data.tags = { set: [], ...buildTags(input.tags) };
    }

    const list = await listRepository.update(listId, data);
    return toListDetail(list);
  },

  // Remove uma lista do usuário.
  async remove(listId: string, userId: string): Promise<void> {
    await assertOwnership(listId, userId);
    await listRepository.delete(listId);
  },

  // Adiciona um item ao final da lista.
  async addItem(listId: string, userId: string, input: ListItemRequest): Promise<ListDetail> {
    await assertOwnership(listId, userId);

    const total = await listRepository.countItems(listId);

    await listRepository.addItem({
      listId,
      order: total,
      url: input.url,
      title: input.title,
      platform: input.platform,
      note: input.note ?? null,
    });

    return this.getById(listId, userId);
  },

  // Edita um item existente da lista.
  async updateItem(
    listId: string,
    userId: string,
    itemId: string,
    input: ListItemRequest,
  ): Promise<ListDetail> {
    await assertOwnership(listId, userId);
    await assertItemBelongsToList(listId, itemId);

    await listRepository.updateItem(itemId, {
      url: input.url,
      title: input.title,
      platform: input.platform,
      note: input.note ?? null,
    });

    return this.getById(listId, userId);
  },

  // Remove um item da lista e reordena os restantes.
  async removeItem(listId: string, userId: string, itemId: string): Promise<ListDetail> {
    await assertOwnership(listId, userId);
    await assertItemBelongsToList(listId, itemId);

    await listRepository.deleteItem(itemId);

    const list = await listRepository.findById(listId);
    if (list) {
      const reorder = list.items.map((item, index) => ({ id: item.id, order: index }));
      if (reorder.length > 0) {
        await listRepository.updateItemsOrder(reorder);
      }
    }

    return this.getById(listId, userId);
  },

  // Reordena os itens conforme a sequência informada.
  async reorder(listId: string, userId: string, input: ReorderItemsRequest): Promise<ListDetail> {
    const list = await assertOwnership(listId, userId);

    const currentIds = new Set(list.items.map((item) => item.id));
    const sameLength = input.itemIds.length === currentIds.size;
    const allBelong = input.itemIds.every((id) => currentIds.has(id));

    if (!sameLength || !allBelong) {
      throw new AppError("A ordem informada não corresponde aos itens da lista.", 400);
    }

    await listRepository.updateItemsOrder(input.itemIds.map((id, order) => ({ id, order })));

    return this.getById(listId, userId);
  },
};

// Garante que o item existe e pertence à lista informada.
async function assertItemBelongsToList(listId: string, itemId: string): Promise<void> {
  const item = await listRepository.findItem(itemId);

  if (!item || item.listId !== listId) {
    throw new AppError("Item não encontrado nesta lista.", 404);
  }
}
