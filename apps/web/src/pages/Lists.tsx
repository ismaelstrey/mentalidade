import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLists } from "../hooks/useLists";

// Rótulos de exibição da visibilidade das listas.
const visibilityLabels: Record<string, string> = {
  PRIVATE: "Privada",
  PUBLIC: "Pública",
  UNLISTED: "Não listada",
};

// Página com as listas do usuário autenticado.
export function Lists() {
  const { data, isLoading, isError } = useLists();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Minha biblioteca</h1>
            <p className="mt-1 text-sm text-slate-400">Suas listas e trilhas de vídeos.</p>
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
              to="/descobrir"
            >
              Descobrir
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
            <Link
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
              to="/listas/nova"
            >
              Nova lista
            </Link>
          </nav>
        </header>

        {isLoading && <p className="mt-8 text-slate-400">Carregando suas listas...</p>}
        {isError && (
          <p className="mt-8 text-red-400">Não foi possível carregar suas listas.</p>
        )}
        {data && data.length === 0 && (
          <p className="mt-8 text-slate-400">
            Você ainda não criou listas. Comece criando a sua primeira trilha.
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {data?.map((list, index) => (
            <motion.article
              key={list.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg"
            >
              <Link to={`/listas/${list.id}`} className="block">
                <h2 className="text-lg font-semibold hover:text-indigo-400">{list.title}</h2>
                {list.description && (
                  <p className="mt-1 text-sm text-slate-400">{list.description}</p>
                )}
              </Link>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full border border-slate-700 px-2 py-0.5">
                  {visibilityLabels[list.visibility] ?? list.visibility}
                </span>
                <span>{list.itemCount} itens</span>
                {list.theme && <span className="text-indigo-400">{list.theme}</span>}
              </div>

              {list.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                  {list.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  );
}
