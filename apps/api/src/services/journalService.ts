import type {
  CreateJournalEntryRequest,
  JournalEntryDto,
  UpdateJournalEntryRequest,
} from "@mentalidade/shared";
import type { Prisma } from "@prisma/client";
import { journalRepository, type JournalEntryWithRelations } from "../repositories/journalRepository";
import { listRepository } from "../repositories/listRepository";
import { gamificationService } from "./gamificationService";
import { AppError } from "../utils/AppError";
import { toJournalDto } from "../utils/journalMapper";

// Garante que a entrada existe e pertence ao usuário informado.
async function assertOwnership(
  entryId: string,
  userId: string,
): Promise<JournalEntryWithRelations> {
  const entry = await journalRepository.findById(entryId);

  if (!entry) {
    throw new AppError("Entrada do diário não encontrada.", 404);
  }
  if (entry.userId !== userId) {
    throw new AppError("Você não tem permissão para alterar esta entrada.", 403);
  }

  return entry;
}

// Valida que a lista informada pertence ao usuário (quando houver vínculo).
async function assertListOwnership(listId: string | null | undefined, userId: string): Promise<void> {
  if (!listId) {
    return;
  }

  const list = await listRepository.findById(listId);
  if (!list) {
    throw new AppError("Lista não encontrada.", 404);
  }
  if (list.ownerId !== userId) {
    throw new AppError("Você só pode vincular reflexões às suas próprias listas.", 403);
  }
}

// Serviço responsável pelo diário de reflexões.
export const journalService = {
  // Lista as entradas do usuário.
  async list(userId: string): Promise<JournalEntryDto[]> {
    const entries = await journalRepository.findManyByUser(userId);
    return entries.map(toJournalDto);
  },

  // Cria uma entrada do diário.
  async create(userId: string, input: CreateJournalEntryRequest): Promise<JournalEntryDto> {
    await assertListOwnership(input.listId, userId);

    const entry = await journalRepository.create({
      userId,
      title: input.title ?? null,
      content: input.content,
      mood: input.mood ?? null,
      visibility: input.visibility ?? "PRIVATE",
      listId: input.listId ?? null,
    });

    // Concede os pontos por registrar uma reflexão.
    await gamificationService.award(userId, "JOURNAL_ENTRY", entry.id);

    return toJournalDto(entry);
  },

  // Retorna uma entrada do usuário.
  async getById(entryId: string, userId: string): Promise<JournalEntryDto> {
    const entry = await assertOwnership(entryId, userId);
    return toJournalDto(entry);
  },

  // Atualiza uma entrada existente.
  async update(
    entryId: string,
    userId: string,
    input: UpdateJournalEntryRequest,
  ): Promise<JournalEntryDto> {
    await assertOwnership(entryId, userId);

    if (input.listId !== undefined) {
      await assertListOwnership(input.listId, userId);
    }

    const data: Prisma.JournalEntryUpdateInput = {};

    if (input.title !== undefined) {
      data.title = input.title;
    }
    if (input.content !== undefined) {
      data.content = input.content;
    }
    if (input.mood !== undefined) {
      data.mood = input.mood;
    }
    if (input.visibility !== undefined) {
      data.visibility = input.visibility;
    }
    if (input.listId !== undefined) {
      data.list = input.listId ? { connect: { id: input.listId } } : { disconnect: true };
    }

    const entry = await journalRepository.update(entryId, data);
    return toJournalDto(entry);
  },

  // Remove uma entrada do usuário.
  async remove(entryId: string, userId: string): Promise<void> {
    await assertOwnership(entryId, userId);
    await journalRepository.delete(entryId);
  },
};
