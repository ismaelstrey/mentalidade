import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Situação de cada fase do roadmap.
type PhaseStatus = "concluida" | "em-andamento" | "pendente";

// Dados de uma fase exibida na página de progresso.
interface Phase {
  id: string;
  title: string;
  status: PhaseStatus;
  summary: string;
  highlights: string[];
}

// Configuração visual de cada situação.
const statusConfig: Record<PhaseStatus, { label: string; className: string }> = {
  concluida: {
    label: "Concluída",
    className: "border-emerald-700 bg-emerald-950/40 text-emerald-300",
  },
  "em-andamento": {
    label: "Em andamento",
    className: "border-amber-700 bg-amber-950/40 text-amber-300",
  },
  pendente: {
    label: "Pendente",
    className: "border-slate-700 bg-slate-900/60 text-slate-400",
  },
};

// Fases do projeto Mentalidade conforme o roadmap interno.
const phases: Phase[] = [
  {
    id: "fase-0",
    title: "Fase 0 — Setup",
    status: "concluida",
    summary: "Estrutura base do monorepo, ferramentas e infraestrutura de desenvolvimento.",
    highlights: [
      "Monorepo pnpm (apps/api, apps/web, packages/shared)",
      "ESLint + TypeScript e .env por ambiente",
      "Prisma + PostgreSQL e Swagger em /api-docs",
    ],
  },
  {
    id: "fase-1",
    title: "Fase 1 — Autenticação e perfis",
    status: "concluida",
    summary: "Cadastro, login e perfis públicos com proteção de rotas.",
    highlights: [
      "Registro e login com JWT + bcrypt",
      "Perfil público @username",
      "Rotas protegidas no frontend",
    ],
  },
  {
    id: "fase-2",
    title: "Fase 2 — Vídeos, temas e listas",
    status: "concluida",
    summary: "CRUD de trilhas com prévia de links e organização por temas.",
    highlights: [
      "CRUD de listas/trilhas e itens com reordenação",
      "Prévia de links do YouTube via oEmbed",
      "Visibilidade privada/pública/não-listada",
    ],
  },
  {
    id: "fase-3",
    title: "Fase 3 — Coletivo",
    status: "concluida",
    summary: "Descoberta pública, importação de listas, curtidas e comentários.",
    highlights: [
      "Busca e filtros com ordenação (top lists)",
      "Fork de listas da comunidade",
      "Curtir e comentar",
    ],
  },
  {
    id: "fase-4",
    title: "Fase 4 — Hábitos e metas",
    status: "concluida",
    summary: "Ferramentas de mudança de comportamento com acompanhamento diário.",
    highlights: [
      "Check-in idempotente, streak e heatmap de 30 dias",
      "Metas com marcos e progresso automático",
    ],
  },
  {
    id: "fase-5",
    title: "Fase 5 — Diário",
    status: "concluida",
    summary: "Reflexões privadas ou públicas com humor e vínculo a trilhas.",
    highlights: [
      "CRUD de entradas de reflexão",
      "Visibilidade privada/pública",
      "Diário público no perfil",
    ],
  },
  {
    id: "fase-6",
    title: "Fase 6 — Gamificação e feed",
    status: "concluida",
    summary: "Pontos/XP, conquistas, ranking e feed social.",
    highlights: [
      "XP, níveis e 6 conquistas",
      "Ranking de contribuição e feed de atividades",
      "Seguir/deixar de seguir usuários",
    ],
  },
  {
    id: "fase-7",
    title: "Fase 7 — Deploy",
    status: "em-andamento",
    summary: "Preparação de produção, PWA e infraestrutura para publicação.",
    highlights: [
      "PWA (manifest, service worker e ícone)",
      "Variáveis de produção e configuração do PM2",
      "Nginx + HTTPS na VPS (pendente de publicação)",
    ],
  },
];

// Calcula a porcentagem de fases concluídas.
function completionRate(): number {
  const done = phases.filter((phase) => phase.status === "concluida").length;
  return Math.round((done / phases.length) * 100);
}

// Página interna de progresso do projeto.
export function Progresso() {
  const rate = completionRate();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Progresso do projeto</h1>
            <p className="mt-1 text-sm text-slate-400">
              Acompanhamento das entregas por fase da plataforma Mentalidade.
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
              to="/evolucao"
            >
              Evolução
            </Link>
          </nav>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Concluído</p>
              <p className="text-2xl font-bold">{rate}%</p>
            </div>
            <p className="text-sm text-slate-400">
              {phases.filter((phase) => phase.status === "concluida").length} de {phases.length} fases
            </p>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${rate}%` }}
            />
          </div>
        </motion.section>

        <ol className="mt-8 space-y-3">
          {phases.map((phase, index) => {
            const config = statusConfig[phase.status];
            return (
              <motion.li
                key={phase.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-slate-100">{phase.title}</h2>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}
                  >
                    {config.label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{phase.summary}</p>
                <ul className="mt-3 space-y-1">
                  {phase.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2 text-xs text-slate-500">
                      <span className="text-indigo-400">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
