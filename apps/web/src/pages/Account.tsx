import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Página da conta do usuário autenticado.
export function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  // Encerra a sessão e volta para a página inicial.
  function handleLogout(): void {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <main className="flex min-h-screen justify-center bg-slate-950 px-6 py-12 text-slate-100">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold">Minha conta</h1>
        <p className="mt-1 text-sm text-slate-400">Dados do seu perfil na plataforma.</p>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <dt className="text-slate-500">Nome</dt>
            <dd>{user.name}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <dt className="text-slate-500">Usuário</dt>
            <dd>@{user.username}</dd>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-2">
            <dt className="text-slate-500">E-mail</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
            to="/listas"
          >
            Minha biblioteca
          </Link>
          <Link
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
            to={`/u/${user.username}`}
          >
            Ver meu perfil público
          </Link>
          <Link
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
            to="/"
          >
            Voltar ao início
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950"
          >
            Sair
          </button>
        </div>
      </motion.section>
    </main>
  );
}
