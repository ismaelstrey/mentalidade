import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useHealth } from "../hooks/useHealth";

// Página inicial da aplicação.
export function Home() {
  const { data, isLoading, isError } = useHealth();
  const { user, isAuthenticated } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-6 text-center text-slate-100">
      <motion.h1
        className="text-4xl font-bold tracking-tight sm:text-5xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Mentalidade
      </motion.h1>
      <p className="max-w-xl text-slate-400">
        Biblioteca coletiva de vídeos e ferramentas para uma mentalidade mais forte.
      </p>
      <span className="rounded-full border border-slate-700 px-4 py-1 text-sm text-slate-300">
        {isLoading && "Verificando API..."}
        {isError && "API indisponível"}
        {data && `API: ${data.data.status}`}
      </span>

      <nav className="flex flex-wrap items-center justify-center gap-3">
        {isAuthenticated && user ? (
          <>
            <Link
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
              to="/listas"
            >
              Minha biblioteca
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/descobrir"
            >
              Descobrir listas
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
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/conta"
            >
              Minha conta
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to={`/u/${user.username}`}
            >
              Meu perfil público
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/progresso"
            >
              Progresso
            </Link>
          </>
        ) : (
          <>
            <Link
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
              to="/entrar"
            >
              Entrar
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/cadastro"
            >
              Criar conta
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/descobrir"
            >
              Descobrir listas
            </Link>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to="/progresso"
            >
              Progresso
            </Link>
          </>
        )}
      </nav>
    </main>
  );
}
