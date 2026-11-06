import type { Platform } from "@mentalidade/shared";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { VideoPlayer } from "../components/VideoPlayer";
import { useAuth } from "../hooks/useAuth";
import { useForkList, useToggleLike } from "../hooks/useCollectiveMutations";
import { useComments } from "../hooks/useComments";
import { useCreateComment, useDeleteComment } from "../hooks/useCommentMutations";
import { useList } from "../hooks/useList";
import { useDeleteList } from "../hooks/useListMutations";
import {
  useAddListItem,
  useDeleteListItem,
  useReorderListItems,
} from "../hooks/useListItemMutations";
import { useLinkPreview } from "../hooks/useLinkPreview";

// Rótulos de exibição da visibilidade das listas.
const visibilityLabels: Record<string, string> = {
  PRIVATE: "Privada",
  PUBLIC: "Pública",
  UNLISTED: "Não listada",
};

// Página de detalhe de uma lista, com gestão de itens.
export function ListDetail() {
  const { id } = useParams<{ id: string }>();
  const listId = id ?? "";
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: list, isLoading, isError } = useList(listId);
  const addItem = useAddListItem(listId);
  const deleteItem = useDeleteListItem(listId);
  const reorderItems = useReorderListItems(listId);
  const deleteList = useDeleteList();
  const preview = useLinkPreview();
  const toggleLike = useToggleLike(listId);
  const forkList = useForkList();
  const { data: comments } = useComments(listId);
  const createComment = useCreateComment(listId);
  const deleteComment = useDeleteComment(listId);

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<Platform>("OUTRO");
  const [commentText, setCommentText] = useState("");

  const isAuthenticated = Boolean(user);
  const isOwner = Boolean(user && list && user.id === list.owner.id);

  // Detecta plataforma e título do link informado.
  async function handleDetect(): Promise<void> {
    if (url.length === 0) {
      return;
    }
    const previewData = await preview.mutateAsync(url);
    setPlatform(previewData.platform);
    if (title.length === 0 && previewData.title) {
      setTitle(previewData.title);
    }
  }

  // Adiciona o item informado ao final da lista.
  async function handleAddItem(event: FormEvent): Promise<void> {
    event.preventDefault();
    await addItem.mutateAsync({ url: url.trim(), title: title.trim(), platform, note: null });
    setUrl("");
    setTitle("");
    setPlatform("OUTRO");
  }

  // Move um item uma posição para cima ou para baixo.
  async function handleMove(index: number, direction: -1 | 1): Promise<void> {
    if (!list) {
      return;
    }
    const ids = list.items.map((item) => item.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) {
      return;
    }
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await reorderItems.mutateAsync({ itemIds: ids });
  }

  // Remove a lista e volta para a biblioteca.
  async function handleDeleteList(): Promise<void> {
    await deleteList.mutateAsync(listId);
    navigate("/listas");
  }

  // Importa esta lista para o acervo do usuário e abre a cópia.
  async function handleFork(): Promise<void> {
    const copy = await forkList.mutateAsync(listId);
    navigate(`/listas/${copy.id}`);
  }

  // Publica o comentário digitado.
  async function handleComment(event: FormEvent): Promise<void> {
    event.preventDefault();
    if (commentText.trim().length === 0) {
      return;
    }
    await createComment.mutateAsync(commentText.trim());
    setCommentText("");
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Carregando lista...
      </main>
    );
  }

  if (isError || !list) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 text-slate-100">
        <p className="text-red-400">Lista não encontrada ou sem acesso.</p>
        <Link className="text-indigo-400 hover:underline" to="/listas">
          Voltar para minha biblioteca
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-3xl"
      >
        <header className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">{list.title}</h1>
              <p className="mt-1 text-sm text-slate-400">
                por{" "}
                <Link className="hover:text-indigo-400" to={`/u/${list.owner.username}`}>
                  @{list.owner.username}
                </Link>
              </p>
            </div>
            {isOwner && (
              <div className="flex flex-wrap gap-2">
                <Link
                  className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
                  to={`/listas/${list.id}/editar`}
                >
                  Editar
                </Link>
                <button
                  type="button"
                  className="rounded-lg border border-red-900 px-3 py-2 text-sm text-red-400 hover:bg-red-950 disabled:opacity-50"
                  onClick={handleDeleteList}
                  disabled={deleteList.isPending}
                >
                  Excluir
                </button>
              </div>
            )}

            {!isOwner && (
              <div className="flex flex-wrap gap-2">
                {isAuthenticated ? (
                  <button
                    type="button"
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800 disabled:opacity-50"
                    onClick={() => toggleLike.mutate()}
                    disabled={toggleLike.isPending}
                  >
                    {list.liked ? "♥ Curtida" : "♡ Curtir"} ({list.likeCount})
                  </button>
                ) : (
                  <Link
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
                    to="/entrar"
                  >
                    ♡ Curtir ({list.likeCount})
                  </Link>
                )}

                {isAuthenticated ? (
                  <button
                    type="button"
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
                    onClick={handleFork}
                    disabled={forkList.isPending}
                  >
                    Importar
                  </button>
                ) : (
                  <Link
                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
                    to="/entrar"
                  >
                    Importar
                  </Link>
                )}
              </div>
            )}
          </div>

          {list.description && <p className="mt-4 text-sm text-slate-300">{list.description}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="rounded-full border border-slate-700 px-2 py-0.5">
              {visibilityLabels[list.visibility] ?? list.visibility}
            </span>
            <span>{list.itemCount} itens</span>
            <span>♥ {list.likeCount}</span>
            <span>⤓ {list.importCount}</span>
            <span>👁 {list.viewCount}</span>
            {list.theme && <span className="text-indigo-400">{list.theme}</span>}
            {list.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
        </header>

        {isOwner && (
          <form
            className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
            onSubmit={handleAddItem}
          >
            <h2 className="text-sm font-semibold text-slate-200">Adicionar vídeo</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <input
                className="min-w-[220px] flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                placeholder="https://..."
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                required
              />
              <button
                type="button"
                className="rounded-lg border border-slate-700 px-3 py-2 text-xs hover:bg-slate-800 disabled:opacity-50"
                onClick={handleDetect}
                disabled={preview.isPending}
              >
                Detectar
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                className="min-w-[220px] flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                placeholder="Título do vídeo"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
              <select
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                value={platform}
                onChange={(event) => setPlatform(event.target.value as Platform)}
              >
                {["YOUTUBE", "FACEBOOK", "INSTAGRAM", "TIKTOK", "OUTRO"].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
                disabled={addItem.isPending}
              >
                Adicionar
              </button>
            </div>
          </form>
        )}

        <ol className="mt-6 space-y-3">
          {list.items.map((item, index) => (
            <li
              key={item.id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <a
                    className="font-medium hover:text-indigo-400"
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {index + 1}. {item.title}
                  </a>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full border border-slate-700 px-2 py-0.5">
                      {item.platform}
                    </span>
                    {item.note && <span>{item.note}</span>}
                  </div>
                </div>

                {isOwner && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="rounded-lg border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800 disabled:opacity-40"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0 || reorderItems.isPending}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800 disabled:opacity-40"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === list.items.length - 1 || reorderItems.isPending}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-red-900 px-2 py-1 text-xs text-red-400 hover:bg-red-950 disabled:opacity-40"
                      onClick={() => deleteItem.mutate(item.id)}
                      disabled={deleteItem.isPending}
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>

              <VideoPlayer item={item} />
            </li>
          ))}
        </ol>

        {list.items.length === 0 && (
          <p className="mt-6 text-sm text-slate-400">Esta lista ainda não tem vídeos.</p>
        )}

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-sm font-semibold text-slate-200">
            Comentários {comments ? `(${comments.length})` : ""}
          </h2>

          {isAuthenticated ? (
            <form className="mt-3" onSubmit={handleComment}>
              <textarea
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                placeholder="Escreva um comentário..."
                rows={2}
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                required
              />
              <button
                type="submit"
                className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
                disabled={createComment.isPending}
              >
                Comentar
              </button>
            </form>
          ) : (
            <p className="mt-2 text-sm text-slate-400">
              <Link className="text-indigo-400 hover:underline" to="/entrar">
                Entre
              </Link>{" "}
              para comentar esta lista.
            </p>
          )}

          <ul className="mt-4 space-y-3">
            {comments?.map((comment) => (
              <li key={comment.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">
                      <Link className="hover:text-indigo-400" to={`/u/${comment.author.username}`}>
                        @{comment.author.username}
                      </Link>{" "}
                      · {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-200">
                      {comment.content}
                    </p>
                  </div>
                  {user && (comment.author.id === user.id || isOwner) && (
                    <button
                      type="button"
                      className="rounded-lg border border-red-900 px-2 py-1 text-xs text-red-400 hover:bg-red-950 disabled:opacity-40"
                      onClick={() => deleteComment.mutate(comment.id)}
                      disabled={deleteComment.isPending}
                    >
                      Remover
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {comments && comments.length === 0 && (
            <p className="mt-3 text-sm text-slate-500">Ainda não há comentários.</p>
          )}
        </section>

        <div className="mt-8">
          <Link className="text-sm text-indigo-400 hover:underline" to="/listas">
            Voltar para minha biblioteca
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
