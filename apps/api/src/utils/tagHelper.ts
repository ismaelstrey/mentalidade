import type { Prisma } from "@prisma/client";

// Monta o vínculo de tags no formato esperado pelo Prisma (cria as que não existirem).
export function buildTags(tags: string[]): Prisma.TagCreateNestedManyWithoutListsInput {
  return {
    connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })),
  };
}
