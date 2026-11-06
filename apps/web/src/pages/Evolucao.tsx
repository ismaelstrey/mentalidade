import type { FeedItem, PointEventType } from "@mentalidade/shared";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useFeed } from "../hooks/useFeed";
import { useGamification } from "../hooks/useGamification";
import { useRanking } from "../hooks/useRanking";

// Rótulos das ações registradas no feed.
const activityLabels: Record<PointEventType, string> = {
  CREATE_LIST: "criou uma nova trilha",
  IMPORT_LIST: "importou uma trilha da comunidade",
  HABIT_CHECKIN: "registrou um check-in de hábito",
  GOAL_DONE: "concluiu uma meta",
  JOURNAL_ENTRY: "escreveu uma reflexão no diário",
};

// Ícones das ações registradas no feed.
const activityIcons: Record<PointEventType, string> = {
  CREATE_LIST: "📚",
  IMPORT_LIST: "⤓",
  HABIT_CHECKIN: "🔥",
  GOAL_DONE: "🎯",
  JOURNAL_ENTRY: "📝",
};

// Formata uma data ISO para o padrão brasileiro com hora.
function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Página de evolução: XP, nível, conquistas, ranking e feed.
export function Evolucao() {
  const { data: stats, isLoading, isError } = useGamification();
  const { data: ranking } = useRanking();
  const { data: feed } = useFeed();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Evolução</h1>
            <p className="mt-1 text-sm text-slate-400">
              Acompanhe sua pontuação, conquistas e a atividade da comunidade.
            </p>
          </div>
          <nav className="flex flex-wrap gap-3">
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/"
            >
              Início
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/diario"
            >
              Diário
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/descobrir"
            >
              Descobrir
            </Link>
          </nav>
        </header>

        {isLoading && <p className="mt-8 text-slate-400">Carregando estatísticas...</p>}
        {isError && <p className="mt-8 text-red-400">Não foi possível carregar sua evolução.</p>}

        {stats && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Nível</p>
                <p className="text-2xl font-bold">
                  {stats.level} · {stats.levelName}
                </p>
              </div>
              <p className="text-lg font-semibold text-indigo-400">{stats.xp} XP</p>
            </div>

            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{
                  width:
                    stats.xpForNextLevel > 0
                      ? `${Math.min(100, (stats.xpIntoLevel / stats.xpForNextLevel) * 100)}%`
                      : "100%",
                }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {stats.xpForNextLevel > 0
                ? `${stats.xpIntoLevel} de ${stats.xpForNextLevel} XP para o próximo nível`
                : "Você alcançou o nível máximo."}
            </p>
          </motion.section>
        )}

        {stats && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-slate-200">Conquistas</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stats.badges.map((badge, index) => (
                <motion.article
                  key={badge.code}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`rounded-xl border p-4 ${
                    badge.earned
                      ? "border-indigo-700 bg-indigo-950/40"
                      : "border-slate-800 bg-slate-900/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${badge.earned ? "" : "grayscale"}`}>
                      {badge.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold">{badge.name}</h3>
                      <p className="text-xs text-slate-400">{badge.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${badge.earned ? "bg-indigo-500" : "bg-slate-600"}`}
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {badge.current}/{badge.target}
                  </p>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-sm font-semibold text-slate-200">Ranking de contribuição</h2>
            {ranking && ranking.length === 0 && (
              <p className="mt-3 text-sm text-slate-500">Ainda não há pontuações registradas.</p>
            )}
            <ol className="mt-3 space-y-2">
              {ranking?.map((entry, index) => (
                <motion.li
                  key={entry.user.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-sm font-bold text-slate-500">
                      {index + 1}
                    </span>
                    <Link
                      className="font-medium hover:text-indigo-400"
                      to={`/u/${entry.user.username}`}
                    >
                      {entry.user.name}
                    </Link>
                    <span className="text-xs text-slate-500">{entry.levelName}</span>
                  </div>
                  <span className="text-sm font-semibold text-indigo-400">{entry.xp} XP</span>
                </motion.li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-sm font-semibold text-slate-200">Atividade da comunidade</h2>
            {feed && feed.length === 0 && (
              <p className="mt-3 text-sm text-slate-500">Nenhuma atividade recente.</p>
            )}
            <ul className="mt-3 space-y-2">
              {feed?.map((item, index) => (
                <FeedRow key={item.id} item={item} index={index} />
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

// Linha do feed com a ação, o autor e a pontuação gerada.
function FeedRow({ item, index }: { item: FeedItem; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4"
    >
      <span className="text-xl">{activityIcons[item.type]}</span>
      <div className="flex-1">
        <p className="text-sm text-slate-300">
          <Link className="font-medium hover:text-indigo-400" to={`/u/${item.actor.username}`}>
            {item.actor.name}
          </Link>{" "}
          {activityLabels[item.type]}
        </p>
        <p className="mt-1 text-xs text-slate-500">{formatDateTime(item.createdAt)}</p>
      </div>
      <span className="text-xs font-semibold text-indigo-400">+{item.points} XP</span>
    </motion.li>
  );
}
