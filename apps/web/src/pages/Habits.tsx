import type { CreateHabitRequest, HabitDto, HabitFrequency, HabitLogStatus } from "@mentalidade/shared";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  useCreateHabit,
  useDeleteHabit,
  useHabitCheckin,
  useHabitUncheckin,
} from "../hooks/useHabitMutations";
import { useHabits } from "../hooks/useHabits";
import { useLists } from "../hooks/useLists";
import { lastNDays, todayString } from "../utils/date";

// Rótulos das frequências de hábito.
const frequencyLabels: Record<HabitFrequency, string> = {
  DAILY: "Diário",
  WEEKLY: "Semanal",
};

// Quantidade de dias exibidos no mapa de calor.
const heatmapDays = 30;

// Página de hábitos: criação, check-in diário, sequência e mapa de calor.
export function Habits() {
  const { data, isLoading, isError } = useHabits();
  const { data: lists } = useLists();
  const createHabit = useCreateHabit();

  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<HabitFrequency>("DAILY");
  const [reminderTime, setReminderTime] = useState("");
  const [listId, setListId] = useState("");

  const today = todayString();

  // Cria o hábito informado no formulário.
  async function handleCreate(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (name.trim().length === 0) {
      return;
    }

    const input: CreateHabitRequest = {
      name: name.trim(),
      frequency,
      reminderTime: reminderTime.length > 0 ? reminderTime : null,
      listId: listId.length > 0 ? listId : null,
    };

    await createHabit.mutateAsync(input);
    setName("");
    setFrequency("DAILY");
    setReminderTime("");
    setListId("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Hábitos</h1>
            <p className="mt-1 text-sm text-slate-400">
              Acompanhe sua constância com check-ins diários.
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
              to="/metas"
            >
              Metas
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
          <h2 className="text-sm font-semibold text-slate-200">Novo hábito</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="Nome do hábito"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              required
            />
            <select
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              value={frequency}
              onChange={(event) => setFrequency(event.target.value as HabitFrequency)}
            >
              {Object.entries(frequencyLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              type="time"
              value={reminderTime}
              onChange={(event) => setReminderTime(event.target.value)}
            />
            <select
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              value={listId}
              onChange={(event) => setListId(event.target.value)}
            >
              <option value="">Sem trilha vinculada</option>
              {lists?.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
              disabled={createHabit.isPending}
            >
              {createHabit.isPending ? "Criando..." : "Criar hábito"}
            </button>
          </div>
          {createHabit.isError && (
            <p className="mt-2 text-sm text-red-400">Não foi possível criar o hábito.</p>
          )}
        </form>

        {isLoading && <p className="mt-8 text-slate-400">Carregando hábitos...</p>}
        {isError && <p className="mt-8 text-red-400">Não foi possível carregar os hábitos.</p>}
        {data && data.length === 0 && (
          <p className="mt-8 text-slate-400">
            Você ainda não tem hábitos. Crie o primeiro e comece a acompanhar.
          </p>
        )}

        <div className="mt-8 space-y-4">
          {data?.map((habit, index) => (
            <HabitCard key={habit.id} habit={habit} today={today} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}

// Cartão de um hábito com check-in, sequência e mapa de calor.
function HabitCard({ habit, today, index }: { habit: HabitDto; today: string; index: number }) {
  const checkin = useHabitCheckin(habit.id);
  const uncheckin = useHabitUncheckin(habit.id);
  const deleteHabit = useDeleteHabit();

  const isDoneToday = habit.todayStatus === "DONE";
  const statusByDate = new Map(habit.logs.map((log) => [log.date, log.status]));
  const days = lastNDays(heatmapDays, today);
  const isPending = checkin.isPending || uncheckin.isPending;

  // Marca ou desmarca o check-in de hoje.
  async function handleToggleToday(): Promise<void> {
    if (isDoneToday) {
      await uncheckin.mutateAsync({ date: today });
      return;
    }
    await checkin.mutateAsync({ date: today, status: "DONE" });
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
          <h3 className="text-lg font-semibold">{habit.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="rounded-full border border-slate-700 px-2 py-0.5">
              {frequencyLabels[habit.frequency]}
            </span>
            {habit.reminderTime && <span>⏰ {habit.reminderTime}</span>}
            {habit.listTitle && <span className="text-indigo-400">{habit.listTitle}</span>}
            <span>🔥 {habit.streak} dias</span>
            <span>{habit.doneInPeriod} nos últimos {heatmapDays} dias</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 ${
              isDoneToday
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
            onClick={handleToggleToday}
            disabled={isPending}
          >
            {isDoneToday ? "Feito hoje ✓" : "Marcar como feito"}
          </button>
          <button
            type="button"
            className="rounded-lg border border-red-900 px-3 py-2 text-xs text-red-400 hover:bg-red-950 disabled:opacity-50"
            onClick={() => deleteHabit.mutate(habit.id)}
            disabled={deleteHabit.isPending}
          >
            Remover
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1">
        {days.map((date) => {
          const status = statusByDate.get(date) as HabitLogStatus | undefined;
          return (
            <span
              key={date}
              title={date}
              className={`h-4 w-4 rounded-sm ${
                status === "DONE"
                  ? "bg-emerald-500"
                  : status === "SKIPPED"
                    ? "bg-amber-500"
                    : "bg-slate-800"
              }`}
            />
          );
        })}
      </div>
    </motion.article>
  );
}
