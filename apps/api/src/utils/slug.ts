import { randomBytes } from "node:crypto";

// Gera um slug amigável a partir do título, com sufixo aleatório para garantir unicidade.
export function generateSlug(title: string): string {
  const base = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const prefix = base.length > 0 ? base : "lista";
  const suffix = randomBytes(3).toString("hex");

  return `${prefix}-${suffix}`;
}
