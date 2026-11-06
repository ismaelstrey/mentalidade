// Definição de um nível da jornada do usuário.
export interface LevelDefinition {
  level: number;
  name: string;
  minXp: number;
}

// Níveis disponíveis, do menor para o maior, conforme o XP acumulado.
export const levels: LevelDefinition[] = [
  { level: 1, name: "Iniciante", minXp: 0 },
  { level: 2, name: "Aprendiz", minXp: 100 },
  { level: 3, name: "Praticante", minXp: 300 },
  { level: 4, name: "Disciplinado", minXp: 700 },
  { level: 5, name: "Focado", minXp: 1500 },
  { level: 6, name: "Mestre", minXp: 3000 },
];

// Resultado do cálculo de nível a partir do XP.
export interface LevelProgress {
  level: number;
  levelName: string;
  xpIntoLevel: number;
  xpForNextLevel: number;
}

// Calcula o nível atual e o progresso até o próximo nível.
export function resolveLevel(xp: number): LevelProgress {
  let current = levels[0];

  for (const definition of levels) {
    if (xp >= definition.minXp) {
      current = definition;
    }
  }

  const index = levels.indexOf(current);
  const next = levels[index + 1];

  return {
    level: current.level,
    levelName: current.name,
    xpIntoLevel: xp - current.minXp,
    // Sem próximo nível, o usuário está no topo da jornada.
    xpForNextLevel: next ? next.minXp - current.minXp : 0,
  };
}
