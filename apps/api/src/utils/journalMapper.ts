import type { JournalEntryDto, JournalFeedItem, JournalVisibility } from "@mentalidade/shared";
import type { JournalEntryWithRelations } from "../repositories/journalRepository";
import { toPublicUser } from "./userMapper";

// Converte o registro do banco para o formato de transporte de uma entrada do diário.
export function toJournalDto(entry: JournalEntryWithRelations): JournalEntryDto {
  return {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    mood: entry.mood,
    visibility: entry.visibility as JournalVisibility,
    listId: entry.listId,
    listTitle: entry.list?.title ?? null,
    createdAt: entry.createdAt.toISOString(),
  };
}

// Converte o registro do banco para uma entrada pública do diário (inclui o autor).
export function toJournalFeedItem(entry: JournalEntryWithRelations): JournalFeedItem {
  return {
    ...toJournalDto(entry),
    author: toPublicUser(entry.user),
  };
}
