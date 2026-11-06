import type { ListItemInput, Platform, Visibility } from "@mentalidade/shared";
import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useList } from "../hooks/useList";
import { useCreateList, useUpdateList } from "../hooks/useListMutations";
import { useLinkPreview } from "../hooks/useLinkPreview";
import { useThemes } from "../hooks/useThemes";

// Item em edição no formulário de criação.
interface ItemDraft {
  url: string;
  title: string;
  platform: Platform;
  note: string;
}

// Item vazio usado ao iniciar ou adicionar uma linha.
const emptyItem: ItemDraft = { url: "", title: "", platform: "OUTRO", note: "" };

// Plataformas disponíveis para seleção manual.
const platforms: Platform[] = ["YOUTUBE", "FACEBOOK", "INSTAGRAM", "TIKTOK", "OUTRO"];

// Formulário de criação e edição de listas.
export function ListForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const listQuery = useList(id ?? "");
  const themesQuery = useThemes();
  const createList = useCreateList();
  const updateList = useUpdateList(id ?? "");
  const preview = useLinkPreview();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  const [tagsInput, setTagsInput] = useState("");
  const [items, setItems] = useState<ItemDraft[]>([]);

  // Preenche o formulário quando a lista a editar é carregada.
  useEffect(() => {
    const list = listQuery.data;
    if (!list) {
      return;
    }
    setTitle(list.title);
    setDescription(list.description ?? "");
    setTheme(list.theme ?? "");
    setVisibility(list.visibility);
    setTagsInput(list.tags.join(", "));
  }, [listQuery.data]);

  // Converte o texto de tags separado por vírgula em uma lista limpa.
  function parseTags(): string[] {
    return tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
  }

  // Atualiza um item em edição pelo índice.
  function updateItemDraft(index: number, patch: Partial<ItemDraft>): void {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  // Detecta a plataforma e o título de um item a partir da URL.
  async function handleDetect(index: number): Promise<void> {
    const item = items[index];
    if (!item || item.url.length === 0) {
      return;
    }
    const previewData = await preview.mutateAsync(item.url);
    updateItemDraft(index, {
      platform: previewData.platform,
      title: item.title.length > 0 ? item.title : previewData.title ?? "",
    });
  }

  // Envia o formulário criando ou atualizando a lista.
  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault();

    if (isEditing) {
      await updateList.mutateAsync({
        title,
        description: description.length > 0 ? description : null,
        theme: theme.length > 0 ? theme : null,
        visibility,
        tags: parseTags(),
      });
      navigate(`/listas/${id}`);
      return;
    }

    const validItems: ListItemInput[] = items
      .filter((item) => item.url.trim().length > 0 && item.title.trim().length > 0)
      .map((item) => ({
        url: item.url.trim(),
        title: item.title.trim(),
        platform: item.platform,
        note: item.note.trim().length > 0 ? item.note.trim() : null,
      }));

    const created = await createList.mutateAsync({
      title,
      description: description.length > 0 ? description : null,
      theme: theme.length > 0 ? theme : null,
      visibility,
      tags: parseTags(),
      items: validItems,
    });
    navigate(`/listas/${created.id}`);
  }

  const isSaving = createList.isPending || updateList.isPending;
  const errorMessage =
    createList.error || updateList.error ? "Não foi possível salvar a lista." : null;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold">{isEditing ? "Editar lista" : "Nova lista"}</h1>
        <p className="mt-1 text-sm text-slate-400">
          {isEditing
            ? "Atualize os dados da sua lista."
            : "Crie uma trilha e adicione os vídeos que você quer guardar."}
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-slate-300" htmlFor="title">
              Título
            </label>
            <input
              id="title"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              maxLength={120}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300" htmlFor="description">
              Descrição
            </label>
            <textarea
              id="description"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-slate-300" htmlFor="theme">
                Tema
              </label>
              <select
                id="theme"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
              >
                <option value="">Sem tema</option>
                {themesQuery.data?.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300" htmlFor="visibility">
                Visibilidade
              </label>
              <select
                id="visibility"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                value={visibility}
                onChange={(event) => setVisibility(event.target.value as Visibility)}
              >
                <option value="PUBLIC">Pública</option>
                <option value="UNLISTED">Não listada</option>
                <option value="PRIVATE">Privada</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300" htmlFor="tags">
              Tags (separadas por vírgula)
            </label>
            <input
              id="tags"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="inicio, habitos, foco"
            />
          </div>

          {isEditing ? (
            <p className="text-sm text-slate-400">
              Os itens da lista são gerenciados na{" "}
              <Link className="text-indigo-400 hover:underline" to={`/listas/${id}`}>
                página da lista
              </Link>
              .
            </p>
          ) : (
            <section className="rounded-xl border border-slate-800 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-200">Vídeos da lista</h2>
                <button
                  type="button"
                  className="rounded-lg border border-slate-700 px-3 py-1 text-xs hover:bg-slate-800"
                  onClick={() => setItems((prev) => [...prev, { ...emptyItem }])}
                >
                  Adicionar vídeo
                </button>
              </div>

              {items.length === 0 && (
                <p className="mt-3 text-xs text-slate-500">
                  Nenhum vídeo adicionado. Você pode incluir depois pela página da lista.
                </p>
              )}

              <div className="mt-3 space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="rounded-lg border border-slate-800 p-3">
                    <div className="flex gap-2">
                      <input
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        placeholder="https://..."
                        value={item.url}
                        onChange={(event) => updateItemDraft(index, { url: event.target.value })}
                      />
                      <button
                        type="button"
                        className="whitespace-nowrap rounded-lg border border-slate-700 px-3 py-1 text-xs hover:bg-slate-800"
                        onClick={() => handleDetect(index)}
                        disabled={preview.isPending}
                      >
                        Detectar
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-red-900 px-3 py-1 text-xs text-red-400 hover:bg-red-950"
                        onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                      >
                        Remover
                      </button>
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
                      <input
                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        placeholder="Título do vídeo"
                        value={item.title}
                        onChange={(event) => updateItemDraft(index, { title: event.target.value })}
                      />
                      <select
                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                        value={item.platform}
                        onChange={(event) =>
                          updateItemDraft(index, { platform: event.target.value as Platform })
                        }
                      >
                        {platforms.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : isEditing ? "Salvar alterações" : "Criar lista"}
            </button>
            <Link
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium hover:bg-slate-800"
              to={isEditing ? `/listas/${id}` : "/listas"}
            >
              Cancelar
            </Link>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
