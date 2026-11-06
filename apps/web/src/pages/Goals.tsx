import type { CreateGoalRequest, GoalDto, GoalStatus } from "@mentalidade/shared";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  useAddMilestone,
  useCreateGoal,
  useDeleteGoal,
  useDeleteMilestone,
  useUpdateGoal,
  useUpdateMilestone,
} from "../hooks/useGoalMutations";
import { useGoals } from "../hooks/useGoals";

// Rótulos das situações de uma meta.
const statusLabels: Record<GoalStatus, string> = {
  ACTIVE: "Em andamento",
  DONE: "Concluída",
  ARCHIVED: "Arquivada",
};

// Cores de exibição de cada situação.
const statusColors: Record<GoalStatus, string> = {
  ACTIVE: "border-indigo-700 text-indigo-300",
  DONE: "border-emerald-700 text-emerald-300",
  ARCHIVED: "border-slate-700 text-slate-400",
};

// Página de metas: criação, progresso e marcos.
export function Goals() {
  const { data, isLoading, isError } = useGoals();
  const createGoal = useCreateGoal();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [milestones, setMilestones] = useState<string[]>([]);

  // Cria a meta informada no formulário.
  async function handleCreate(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (title.trim().length === 0) {
      return;
    }

    const input: CreateGoalRequest = {
      title: title.trim(),
      description: description.trim().length > 0 ? description.trim() : null,
      targetDate: targetDate.length > 0 ? targetDate : null,
      milestones: milestones.map((item) => item.trim()).filter((item) => item.length > 0),
    };

    await createGoal.mutateAsync(input);
    setTitle("");
    setDescription("");
    setTargetDate("");
    setMilestones([]);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Metas</h1>
            <p className="mt-1 text-sm text-slate-400">
              Defina objetivos, prazos e acompanhe o progresso por marcos.
            </p>
          </div>
          <nav className="flex gap-3">
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/"
            >
              Início
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/listas"
            >
              Biblioteca
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/habitos"
            >
              Hábitos
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/diario"
            >
              Diário
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/evolucao"
            >
              Evolução
            </Link>
          </nav>
        </header>

        <form
          className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
          onSubmit={handleCreate}
        >
          <h2 className="text-sm font-semibold text-slate-200">Nova meta</h2>
          <div className="mt-3 space-y-3">
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="Título da meta"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              required
            />
            <textarea
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="Descrição (opcional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={2}
              maxLength={1000}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-slate-300" htmlFor="targetDate">
                  Prazo
                </label>
                <input
                  id="targetDate"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  type="date"
                  value={targetDate}
                  onChange={(event) => setTargetDate(event.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  className="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800"
                  onClick={() => setMilestones((prev) => [...prev, ""])}
                >
                  Adicionar marco
                </button>
              </div>
            </div>

            {milestones.length > 0 && (
              <div className="space-y-2">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                      placeholder="Marco"
                      value={milestone}
                      onChange={(event) =>
                        setMilestones((prev) =>
                          prev.map((item, i) => (i === index ? event.target.value : item)),
                        )
                      }
                    />
                    <button
                      type="button"
                      className="rounded-lg border border-red-900 px-3 py-1 text-xs text-red-400 hover:bg-red-950"
                      onClick={() => setMilestones((prev) => prev.filter((_, i) => i !== index))}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-3">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
              disabled={createGoal.isPending}
            >
              {createGoal.isPending ? "Criando..." : "Criar meta"}
            </button>
          </div>
          {createGoal.isError && (
            <p className="mt-2 text-sm text-red-400">Não foi possível criar a meta.</p>
          )}
        </form>

        {isLoading && <p className="mt-8 text-slate-400">Carregando metas...</p>}
        {isError && <p className="mt-8 text-red-400">Não foi possível carregar as metas.</p>}
        {data && data.length === 0 && (
          <p className="mt-8 text-slate-400">
            Você ainda não definiu metas. Comece criando a primeira.
          </p>
        )}

        <div className="mt-8 space-y-4">
          {data?.map((goal, index) => (
            <GoalCard key={goal.id} goal={goal} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}

// Cartão de uma meta com progresso, marcos e ações.
function GoalCard({ goal, index }: { goal: GoalDto; index: number }) {
  const updateGoal = useUpdateGoal(goal.id);
  const deleteGoal = useDeleteGoal();
  const addMilestone = useAddMilestone(goal.id);
  const updateMilestone = useUpdateMilestone(goal.id);
  const deleteMilestone = useDeleteMilestone(goal.id);

  const [newMilestone, setNewMilestone] = useState("");

  // Adiciona um novo marco à meta.
  async function handleAddMilestone(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (newMilestone.trim().length === 0) {
      return;
    }
    await addMilestone.mutateAsync(newMilestone.trim());
    setNewMilestone("");
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{goal.title}</h3>
          {goal.description && <p className="mt-1 text-sm text-slate-400">{goal.description}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className={`rounded-full border px-2 py-0.5 ${statusColors[goal.status]}`}>
              {statusLabels[goal.status]}
            </span>
            {goal.targetDate && (
              <span className="text-slate-400">
                Prazo: {goal.targetDate.slice(0, 10)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {goal.status !== "DONE" ? (
            <button
              type="button"
              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium hover:bg-emerald-500 disabled:opacity-50"
              onClick={() => updateGoal.mutate({ status: "DONE" })}
              disabled={updateGoal.isPending}
            >
              Concluir
            </button>
          ) : (
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800"
              onClick={() => updateGoal.mutate({ status: "ACTIVE" })}
              disabled={updateGoal.isPending}
            >
              Reativar
            </button>
          )}
          {goal.status !== "ARCHIVED" && (
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800"
              onClick={() => updateGoal.mutate({ status: "ARCHIVED" })}
              disabled={updateGoal.isPending}
            >
              Arquivar
            </button>
          )}
          <button
            type="button"
            className="rounded-lg border border-red-900 px-3 py-2 text-xs text-red-400 hover:bg-red-950 disabled:opacity-50"
            onClick={() => deleteGoal.mutate(goal.id)}
            disabled={deleteGoal.isPending}
          >
            Remover
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Progresso</span>
          <span>{goal.progress}%</span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Marcos</h4>
        {goal.milestones.length === 0 && (
          <p className="mt-2 text-xs text-slate-500">
            Nenhum marco. O progresso é definido manualmente ao editar a meta.
          </p>
        )}

        <ul className="mt-2 space-y-2">
          {goal.milestones.map((milestone) => (
            <li key={milestone.id} className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-indigo-500"
                  checked={milestone.done}
                  onChange={(event) =>
                    updateMilestone.mutate({
                      milestoneId: milestone.id,
                      data: { done: event.target.checked },
                    })
                  }
                  disabled={updateMilestone.isPending}
                />
                <span className={milestone.done ? "text-slate-500 line-through" : "text-slate-200"}>
                  {milestone.title}
                </span>
              </label>
              <button
                type="button"
                className="rounded-lg border border-slate-800 px-2 py-0.5 text-xs text-slate-400 hover:bg-slate-800"
                onClick={() => deleteMilestone.mutate(milestone.id)}
                disabled={deleteMilestone.isPending}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>

        <form className="mt-3 flex gap-2" onSubmit={handleAddMilestone}>
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="Novo marco"
            value={newMilestone}
            onChange={(event) => setNewMilestone(event.target.value)}
            maxLength={120}
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800 disabled:opacity-50"
            disabled={addMilestone.isPending}
          >
            Adicionar
          </button>
        </form>
      </div>
    </motion.article>
  );
}
