import type { JournalEntry, Prisma } from "@prisma/client";
import { prisma } from "./prismaClient";

// Relações carregadas junto de cada entrada do diário.
const journalInclude = {
  list: { select: { title: true } },
  user: true,
} satisfies Prisma.JournalEntryInclude;

// Tipo de uma entrada com as relações carregadas.
export type JournalEntryWithRelations = Prisma.JournalEntryGetPayload<{
  include: typeof journalInclude;
}>;

// Repositório com as operações de banco relacionadas ao diário de reflexões.
export const journalRepository = {
  // Lista as entradas de um usuário, das mais recentes para as mais antigas.
  findManyByUser(userId: string): Promise<JournalEntryWithRelations[]> {
    return prisma.journalEntry.findMany({
      where: { userId },
      include: journalInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  // Lista apenas as entradas públicas de um usuário.
  findPublicByUser(userId: string): Promise<JournalEntryWithRelations[]> {
    return prisma.journalEntry.findMany({
      where: { userId, visibility: "PUBLIC" },
      include: journalInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  // Busca uma entrada pelo identificador.
  findById(id: string): Promise<JournalEntryWithRelations | null> {
    return prisma.journalEntry.findUnique({ where: { id }, include: journalInclude });
  },

  // Cria uma entrada do diário.
  create(data: Prisma.JournalEntryUncheckedCreateInput): Promise<JournalEntryWithRelations> {
    return prisma.journalEntry.create({ data, include: journalInclude });
  },

  // Atualiza uma entrada do diário.
  update(id: string, data: Prisma.JournalEntryUpdateInput): Promise<JournalEntryWithRelations> {
    return prisma.journalEntry.update({ where: { id }, data, include: journalInclude });
  },

  // Remove uma entrada do diário.
  delete(id: string): Promise<JournalEntry> {
    return prisma.journalEntry.delete({ where: { id } });
  },
};
