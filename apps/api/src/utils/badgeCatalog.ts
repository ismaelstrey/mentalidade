import type { BadgeDto } from "@mentalidade/shared";

// Métricas do usuário usadas para avaliar a conquista das badges.
export interface BadgeMetrics {
  lists: number;
  imports: number;
  habitCheckins: number;
  goalsDone: number;
  journalEntries: number;
}

// Definição de uma conquista do catálogo fixo da plataforma.
export interface BadgeDefinition {
  code: string;
  name: string;
  description: string;
  icon: string;
  metric: keyof BadgeMetrics;
  target: number;
}

// Catálogo de conquistas da plataforma.
export const badgeCatalog: BadgeDefinition[] = [
  {
    code: "first-list",
    name: "Primeira trilha",
    description: "Criou sua primeira trilha.",
    icon: "📚",
    metric: "lists",
    target: 1,
  },
  {
    code: "curator",
    name: "Curador",
    description: "Criou 10 trilhas.",
    icon: "🗂️",
    metric: "lists",
    target: 10,
  },
  {
    code: "explorer",
    name: "Explorador",
    description: "Importou 5 trilhas da comunidade.",
    icon: "🧭",
    metric: "imports",
    target: 5,
  },
  {
    code: "consistent",
    name: "Constante",
    description: "Acumulou 30 check-ins de hábitos.",
    icon: "🔥",
    metric: "habitCheckins",
    target: 30,
  },
  {
    code: "achiever",
    name: "Realizador",
    description: "Concluiu 3 metas.",
    icon: "🎯",
    metric: "goalsDone",
    target: 3,
  },
  {
    code: "reflective",
    name: "Reflexivo",
    description: "Escreveu 10 reflexões no diário.",
    icon: "📝",
    metric: "journalEntries",
    target: 10,
  },
];

// Avalia as conquistas do usuário a partir das métricas coletadas.
export function evaluateBadges(metrics: BadgeMetrics): BadgeDto[] {
  return badgeCatalog.map((badge) => {
    const current = metrics[badge.metric];
    const progress = Math.min(100, Math.round((current / badge.target) * 100));

    return {
      code: badge.code,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      earned: current >= badge.target,
      current,
      target: badge.target,
      progress,
    };
  });
}
