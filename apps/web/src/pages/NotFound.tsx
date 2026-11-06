import { Link } from "react-router-dom";

// Página exibida quando a rota acessada não existe.
export function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-slate-400">Página não encontrada.</p>
      <Link
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500"
        to="/"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
