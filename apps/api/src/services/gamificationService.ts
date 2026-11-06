import type {
  FeedItem,
  GamificationStats,
  PointEventType,
  RankingEntry,
} from "@mentalidade/shared";
import { gamificationRepository } from "../repositories/gamificationRepository";
import { userRepository } from "../repositories/userRepository";
import { evaluateBadges, type BadgeMetrics } from "../utils/badgeCatalog";
import { resolveLevel } from "../utils/levelHelper";
import { toPublicUser } from "../utils/userMapper";

// Pontos concedidos por cada tipo de ação.
export const pointValues: Record<PointEventType, number> = {
  CREATE_LIST: 20,
  IMPORT_LIST: 10,
  HABIT_CHECKIN: 5,
  GOAL_DONE: 50,
  JOURNAL_ENTRY: 10,
};

// Coleta as métricas usadas na avaliação das conquistas.
async function loadMetrics(userId: string): Promise<BadgeMetrics> {
  const [lists, imports, habitCheckins, goalsDone, journalEntries] = await Promise.all([
    gamificationRepository.countLists(userId),
    gamificationRepository.countForks(userId),
    gamificationRepository.countHabitCheckins(userId),
    gamificationRepository.countDoneGoals(userId),
    gamificationRepository.countJournalEntries(userId),
  ]);

  return { lists, imports, habitCheckins, goalsDone, journalEntries };
}

// Serviço responsável pela gamificação: pontos, níveis, conquistas, ranking e feed.
export const gamificationService = {
  // Registra um evento de pontos. Usado pelos demais serviços.
  async award(userId: string, type: PointEventType, refId?: string): Promise<void> {
    await gamificationRepository.create({
      userId,
      type,
      points: pointValues[type],
      refId: refId ?? null,
    });
  },

  // Retorna as estatísticas de gamificação do usuário (XP, nível e conquistas).
  async getStats(userId: string): Promise<GamificationStats> {
    const [xp, metrics] = await Promise.all([
      gamificationRepository.sumPoints(userId),
      loadMetrics(userId),
    ]);

    const progress = resolveLevel(xp);

    return {
      xp,
      level: progress.level,
      levelName: progress.levelName,
      xpIntoLevel: progress.xpIntoLevel,
      xpForNextLevel: progress.xpForNextLevel,
      badges: evaluateBadges(metrics),
    };
  },

  // Retorna o ranking de contribuição por pontuação.
  async getRanking(limit = 20): Promise<RankingEntry[]> {
    const rows = await gamificationRepository.groupPointsByUser(limit);
    const users = await userRepository.findManyByIds(rows.map((row) => row.userId));
    const usersById = new Map(users.map((user) => [user.id, user]));

    return rows.flatMap((row) => {
      const user = usersById.get(row.userId);
      if (!user) {
        return [];
      }

      const progress = resolveLevel(row.total);
      return [
        {
          user: toPublicUser(user),
          xp: row.total,
          level: progress.level,
          levelName: progress.levelName,
        },
      ];
    });
  },

  // Retorna o feed de atividades recentes da comunidade.
  async getFeed(limit = 30): Promise<FeedItem[]> {
    const events = await gamificationRepository.listRecent(limit);

    return events.map((event) => ({
      id: event.id,
      type: event.type as PointEventType,
      points: event.points,
      createdAt: event.createdAt.toISOString(),
      actor: toPublicUser(event.user),
    }));
  },
};
