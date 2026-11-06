import type {
  CommentDto,
  ListCard,
  ListDetail,
  ListItemDto,
  ListSummary,
  Platform,
  Visibility,
} from "@mentalidade/shared";
import type { ListWithRelations } from "../repositories/listRepository";
import { toPublicUser } from "./userMapper";

// Converte um item do banco para o formato de transporte.
export function toListItemDto(item: {
  id: string;
  order: number;
  url: string;
  title: string;
  platform: string;
  note: string | null;
}): ListItemDto {
  return {
    id: item.id,
    order: item.order,
    url: item.url,
    title: item.title,
    platform: item.platform as Platform,
    note: item.note,
  };
}

// Converte o registro do banco para o resumo de uma lista.
export function toListSummary(list: ListWithRelations): ListSummary {
  return {
    id: list.id,
    title: list.title,
    slug: list.slug,
    description: list.description,
    theme: list.theme,
    visibility: list.visibility as Visibility,
    likeCount: list.likeCount,
    importCount: list.importCount,
    viewCount: list.viewCount,
    itemCount: list._count.items,
    tags: list.tags.map((tag) => tag.name),
    createdAt: list.createdAt.toISOString(),
  };
}

// Converte o registro do banco para a lista pública resumida (inclui o autor).
export function toListCard(list: ListWithRelations): ListCard {
  return {
    ...toListSummary(list),
    owner: toPublicUser(list.owner),
  };
}

// Converte o registro do banco para o detalhe de uma lista (inclui dono e itens).
export function toListDetail(list: ListWithRelations, liked = false): ListDetail {
  return {
    ...toListSummary(list),
    owner: toPublicUser(list.owner),
    items: list.items.map(toListItemDto),
    liked,
  };
}

// Converte o registro do banco para o comentário de uma lista.
export function toCommentDto(comment: {
  id: string;
  content: string;
  createdAt: Date;
  user: ListWithRelations["owner"];
}): CommentDto {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    author: toPublicUser(comment.user),
  };
}
