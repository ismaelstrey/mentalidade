import type { DiscoverQuery, ListSort, Platform } from "@mentalidade/shared";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useDiscover } from "../hooks/useDiscover";
import { useThemes } from "../hooks/useThemes";

// Quantidade de listas exibidas por página na descoberta.
const perPage = 12;

// Rótulos das opções de ordenação.
const sortLabels: Record<ListSort, string> = {
  popular: "Mais importadas",
  recent: "Mais recentes",
  likes: "Mais curtidas",
  views: "Mais vistas",
};

// Plataformas disponíveis para filtro.
const platforms: Platform[] = ["YOUTUBE", "FACEBOOK", "INSTAGRAM", "TIKTOK", "OUTRO"];

// Página de descoberta coletiva das listas públicas.
export function Discover() {
  const { data: themes } = useThemes();

  const [term, setTerm] = useState("");
  const [appliedTerm, setAppliedTerm] = useState("");
  const [theme, setTheme] = useState("");
  const [tag, setTag] = useState("");
  const [platform, setPlatform] = useState<Platform | "">("");
  const [sort, setSort] = useState<ListSort>("popular");
  const [page, setPage] = useState(1);

  const query: DiscoverQuery = {
    q: appliedTerm || undefined,
    theme: theme || undefined,
    tag: tag || undefined,
    platform: platform || undefined,
    sort,
    page,
    perPage,
  };

  const { data, isLoading, isError } = useDiscover(query);
  const totalPages = data ? Math.max(1, Math.ceil(data.total / perPage)) : 1;

  // Aplica a busca digitada e volta para a primeira página.
  function handleSearch(event: FormEvent): void {
    event.preventDefault();
    setAppliedTerm(term.trim());
    setPage(1);
  }

  // Limpa todos os filtros aplicados.
  function handleClear(): void {
    setTerm("");
    setAppliedTerm("");
    setTheme("");
    setTag("");
    setPlatform("");
    setSort("popular");
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Descobrir listas</h1>
            <p className="mt-1 text-sm text-slate-400">
              Explore e importe trilhas criadas pela comunidade.
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
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
              to="/listas"
            >
              Minha biblioteca
            </Link>
          </nav>
        </header>

        <form
          className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
          onSubmit={handleSearch}
        >
          <div className="flex flex-wrap gap-2">
            <input
              className="min-w-[220px] flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="Buscar por título ou descrição"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
            >
              Buscar
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
              onClick={handleClear}
            >
              Limpar
            </button>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            <select
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              value={theme}
              onChange={(event) => {
                setTheme(event.target.value);
                setPage(1);
              }}
            >
              <option value="">Todos os temas</option>
              {themes?.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.label}
                </option>
              ))}
            </select>

            <input
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder="Tag"
              value={tag}
              onChange={(event) => {
                setTag(event.target.value.trim());
                setPage(1);
              }}
            />

            <select
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              value={platform}
              onChange={(event) => {
                setPlatform(event.target.value as Platform | "");
                setPage(1);
              }}
            >
              <option value="">Todas as plataformas</option>
              {platforms.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as ListSort);
                setPage(1);
              }}
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </form>

        {isLoading && <p className="mt-8 text-slate-400">Carregando listas...</p>}
        {isError && <p className="mt-8 text-red-400">Não foi possível carregar as listas.</p>}
        {data && data.items.length === 0 && (
          <p className="mt-8 text-slate-400">Nenhuma lista encontrada com esses filtros.</p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((list, index) => (
            <motion.article
              key={list.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg"
            >
              <Link to={`/listas/${list.id}`} className="block">
                <h2 className="text-lg font-semibold hover:text-indigo-400">{list.title}</h2>
                {list.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">{list.description}</p>
                )}
              </Link>

              <p className="mt-2 text-xs text-slate-500">
                por{" "}
                <Link className="hover:text-indigo-400" to={`/u/${list.owner.username}`}>
                  @{list.owner.username}
                </Link>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span>{list.itemCount} itens</span>
                <span>♥ {list.likeCount}</span>
                <span>⤓ {list.importCount}</span>
                <span>👁 {list.viewCount}</span>
              </div>

              {list.theme && <span className="mt-2 text-xs text-indigo-400">{list.theme}</span>}
            </motion.article>
          ))}
        </div>

        {data && data.total > perPage && (
          <div className="mt-8 flex items-center justify-center gap-4 text-sm">
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-2 hover:bg-slate-800 disabled:opacity-40"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
            >
              Anterior
            </button>
            <span className="text-slate-400">
              Página {data.page} de {totalPages}
            </span>
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-2 hover:bg-slate-800 disabled:opacity-40"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
