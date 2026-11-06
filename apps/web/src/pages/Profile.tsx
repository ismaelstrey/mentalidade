import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFollowState, useToggleFollow } from "../hooks/useFollow";
import { useProfile } from "../hooks/useProfile";
import { useUserJournal } from "../hooks/useUserJournal";
import { useUserLists } from "../hooks/useUserLists";

// Formata uma data ISO para o padrão brasileiro.
function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("pt-BR");
}

// Página com o perfil público de um usuário.
export function Profile() {
  const { username = "" } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { data, isLoading, isError } = useProfile(username);
  const { data: lists } = useUserLists(username);
  const { data: journal } = useUserJournal(username);
  const { data: followState } = useFollowState(username);
  const toggleFollow = useToggleFollow(username);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        Carregando perfil...
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100">
        <h1 className="text-2xl font-bold">Perfil não encontrado</h1>
        <p className="text-slate-400">O usuário @{username} não existe ou está indisponível.</p>
        <Link
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
          to="/"
        >
          Voltar ao início
        </Link>
      </main>
    );
  }

  const { user, stats } = data;

  return (
    <main className="flex min-h-screen justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl"
      >
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              className="h-16 w-16 rounded-full object-cover"
              src={user.avatarUrl}
              alt={user.name}
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-sm text-slate-400">@{user.username}</p>
          </div>
          {isAuthenticated && currentUser?.username !== user.username && (
            <button
              type="button"
              className={`ml-auto rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                followState?.following
                  ? "border border-slate-700 hover:bg-slate-800"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
              onClick={() => toggleFollow.mutate()}
              disabled={toggleFollow.isPending}
            >
              {followState?.following ? "Deixar de seguir" : "Seguir"}
            </button>
          )}
        </div>

        {user.bio && <p className="mt-6 text-sm leading-relaxed text-slate-300">{user.bio}</p>}

        <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-800 pt-6 text-center">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Listas</dt>
            <dd className="text-xl font-semibold">{stats.lists}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Seguidores</dt>
            <dd className="text-xl font-semibold">{stats.followers}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Seguindo</dt>
            <dd className="text-xl font-semibold">{stats.following}</dd>
          </div>
        </dl>

        <p className="mt-6 text-xs text-slate-500">Membro desde {formatDate(user.createdAt)}.</p>

        <section className="mt-6 border-t border-slate-800 pt-6">
          <h2 className="text-sm font-semibold text-slate-200">Listas públicas</h2>

          {lists && lists.length === 0 && (
            <p className="mt-3 text-sm text-slate-500">Nenhuma lista pública ainda.</p>
          )}

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {lists?.map((list, index) => (
              <motion.article
                key={list.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <Link to={`/listas/${list.id}`} className="block">
                  <h3 className="font-medium hover:text-indigo-400">{list.title}</h3>
                </Link>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span>{list.itemCount} itens</span>
                  <span>♥ {list.likeCount}</span>
                  <span>⤓ {list.importCount}</span>
                  {list.theme && <span className="text-indigo-400">{list.theme}</span>}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mt-6 border-t border-slate-800 pt-6">
          <h2 className="text-sm font-semibold text-slate-200">Diário público</h2>

          {journal && journal.length === 0 && (
            <p className="mt-3 text-sm text-slate-500">Nenhuma reflexão pública ainda.</p>
          )}

          <div className="mt-3 space-y-3">
            {journal?.map((entry, index) => (
              <motion.article
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{formatDate(entry.createdAt)}</span>
                  {entry.mood && (
                    <span className="rounded-full border border-indigo-800 px-2 py-0.5 text-indigo-300">
                      {entry.mood}
                    </span>
                  )}
                </div>
                {entry.title && <h3 className="mt-2 font-medium">{entry.title}</h3>}
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
              </motion.article>
            ))}
          </div>
        </section>

        <div className="mt-6 flex gap-3">
          <Link
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
            to="/"
          >
            Voltar ao início
          </Link>
        </div>
      </motion.section>
    </main>
  );
}
