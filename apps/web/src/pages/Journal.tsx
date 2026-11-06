import type {
  JournalEntryDto,
  JournalVisibility,
  ListSummary,
} from "@mentalidade/shared";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useJournal } from "../hooks/useJournal";
import {
  useCreateJournalEntry,
  useDeleteJournalEntry,
  useUpdateJournalEntry,
} from "../hooks/useJournalMutations";
import { useLists } from "../hooks/useLists";

// Opções de humor exibidas no formulário.
const moodOptions = [
  { value: "great", label: "😄 Ótimo" },
  { value: "good", label: "🙂 Bem" },
  { value: "neutral", label: "😐 Neutro" },
  { value: "low", label: "😔 Baixo" },
  { value: "bad", label: "😣 Mal" },
];

// Rótulos das visibilidades de uma reflexão.
const visibilityLabels: Record<JournalVisibility, string> = {
  PRIVATE: "Privada",
  PUBLIC: "Pública",
};

// Formata uma data ISO para o padrão brasileiro com hora.
function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Página do diário: registro e histórico de reflexões.
export function Journal() {
  const { data, isLoading, isError } = useJournal();
  const { data: lists } = useLists();
  const createEntry = useCreateJournalEntry();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [visibility, setVisibility] = useState<JournalVisibility>("PRIVATE");
  const [listId, setListId] = useState("");

  // Cria a reflexão informada no formulário.
  async function handleCreate(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (content.trim().length === 0) {
      return;
    }

    await createEntry.mutateAsync({
      title: title.trim().length > 0 ? title.trim() : null,
      content: content.trim(),
      mood: mood.length > 0 ? mood : null,
      visibility,
      listId: listId.length > 0 ? listId : null,
    });

    setTitle("");
    setContent("");
    setMood("");
    setVisibility("PRIVATE");
    setListId("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Diário</h1>
            <p className="mt-1 text-sm text-slate-400">
              Registre reflexões e acompanhe sua evolução ao longo do tempo.
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
              to="/habitos"
            >
              Hábitos
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/metas"
            >
              Metas
            </Link>
          </nav>
        </header>

        <form
          className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
          onSubmit={handleCreate}
        >
          <h2 className="text-sm font-semibold text-slate-200">Nova reflexão</h2>
          <div className="mt-3 space-y-3">
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="Título (opcional)"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
            />
            <textarea
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="O que você quer registrar hoje?"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={4}
              maxLength={10000}
              required
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="text-sm text-slate-300">
                Humor
                <select
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  value={mood}
                  onChange={(event) => setMood(event.target.value)}
                >
                  <option value="">Sem humor</option>
                  {moodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-slate-300">
                Visibilidade
                <select
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  value={visibility}
                  onChange={(event) => setVisibility(event.target.value as JournalVisibility)}
                >
                  <option value="PRIVATE">Privada</option>
                  <option value="PUBLIC">Pública</option>
                </select>
              </label>
              <label className="text-sm text-slate-300">
                Trilha
                <select
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                  value={listId}
                  onChange={(event) => setListId(event.target.value)}
                >
                  <option value="">Sem vínculo</option>
                  {lists?.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-3">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
              disabled={createEntry.isPending}
            >
              {createEntry.isPending ? "Registrando..." : "Registrar reflexão"}
            </button>
          </div>
          {createEntry.isError && (
            <p className="mt-2 text-sm text-red-400">Não foi possível registrar a reflexão.</p>
          )}
        </form>

        {isLoading && <p className="mt-8 text-slate-400">Carregando reflexões...</p>}
        {isError && <p className="mt-8 text-red-400">Não foi possível carregar o diário.</p>}
        {data && data.length === 0 && (
          <p className="mt-8 text-slate-400">
            Você ainda não registrou reflexões. Comece escrevendo a primeira.
          </p>
        )}

        <div className="mt-8 space-y-4">
          {data?.map((entry, index) => (
            <JournalCard key={entry.id} entry={entry} index={index} lists={lists ?? []} />
          ))}
        </div>
      </div>
    </main>
  );
}

// Cartão de uma reflexão com edição inline e remoção.
function JournalCard({
  entry,
  index,
  lists,
}: {
  entry: JournalEntryDto;
  index: number;
  lists: ListSummary[];
}) {
  const updateEntry = useUpdateJournalEntry(entry.id);
  const deleteEntry = useDeleteJournalEntry();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(entry.title ?? "");
  const [content, setContent] = useState(entry.content);
  const [mood, setMood] = useState(entry.mood ?? "");
  const [visibility, setVisibility] = useState<JournalVisibility>(entry.visibility);
  const [listId, setListId] = useState(entry.listId ?? "");

  // Salva as alterações da reflexão.
  async function handleSave(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (content.trim().length === 0) {
      return;
    }

    await updateEntry.mutateAsync({
      title: title.trim().length > 0 ? title.trim() : null,
      content: content.trim(),
      mood: mood.length > 0 ? mood : null,
      visibility,
      listId: listId.length > 0 ? listId : null,
    });

    setIsEditing(false);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg"
    >
      {isEditing ? (
        <form className="space-y-3" onSubmit={handleSave}>
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="Título (opcional)"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
          />
          <textarea
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={4}
            maxLength={10000}
            required
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm text-slate-300">
              Humor
              <select
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                value={mood}
                onChange={(event) => setMood(event.target.value)}
              >
                <option value="">Sem humor</option>
                {moodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-300">
              Visibilidade
              <select
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                value={visibility}
                onChange={(event) => setVisibility(event.target.value as JournalVisibility)}
              >
                <option value="PRIVATE">Privada</option>
                <option value="PUBLIC">Pública</option>
              </select>
            </label>
            <label className="text-sm text-slate-300">
              Trilha
              <select
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                value={listId}
                onChange={(event) => setListId(event.target.value)}
              >
                <option value="">Sem vínculo</option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
              disabled={updateEntry.isPending}
            >
              {updateEntry.isPending ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{formatDateTime(entry.createdAt)}</span>
                <span className="rounded-full border border-slate-700 px-2 py-0.5">
                  {visibilityLabels[entry.visibility]}
                </span>
                {entry.mood && (
                  <span className="rounded-full border border-indigo-800 px-2 py-0.5 text-indigo-300">
                    {moodOptions.find((option) => option.value === entry.mood)?.label ?? entry.mood}
                  </span>
                )}
              </div>
              {entry.title && <h3 className="mt-2 text-lg font-semibold">{entry.title}</h3>}
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                {entry.content}
              </p>
              {entry.listId && (
                <Link
                  className="mt-2 inline-block text-xs text-indigo-400 hover:text-indigo-300"
                  to={`/listas/${entry.listId}`}
                >
                  {entry.listTitle ?? "Trilha vinculada"}
                </Link>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </button>
              <button
                type="button"
                className="rounded-lg border border-red-900 px-3 py-2 text-xs text-red-400 hover:bg-red-950 disabled:opacity-50"
                onClick={() => deleteEntry.mutate(entry.id)}
                disabled={deleteEntry.isPending}
              >
                Remover
              </button>
            </div>
          </div>
        </>
      )}
    </motion.article>
  );
}
