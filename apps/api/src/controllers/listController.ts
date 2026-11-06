import type { Request, Response } from "express";
import { listService } from "../services/listService";
import { AppError } from "../utils/AppError";
import {
  createListSchema,
  listItemBodySchema,
  reorderSchema,
  updateListSchema,
} from "../validators/listValidator";

// Recupera o identificador do usuário autenticado.
function requireUserId(req: Request): string {
  const user = req.user;
  if (!user) {
    throw new AppError("Usuário não autenticado.", 401);
  }
  return user.id;
}

// Lista as listas do usuário autenticado.
export async function listMineController(req: Request, res: Response): Promise<void> {
  const lists = await listService.listMine(requireUserId(req));
  res.json({ data: lists, message: "ok" });
}

// Cria uma nova lista.
export async function createListController(req: Request, res: Response): Promise<void> {
  const input = createListSchema.parse(req.body);
  const list = await listService.create(requireUserId(req), input);
  res.status(201).json({ data: list, message: "Lista criada com sucesso." });
}

// Retorna o detalhe de uma lista.
export async function getListController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const list = await listService.getById(req.params.id, req.user?.id);
  res.json({ data: list, message: "ok" });
}

// Atualiza uma lista existente.
export async function updateListController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const input = updateListSchema.parse(req.body);
  const list = await listService.update(req.params.id, requireUserId(req), input);
  res.json({ data: list, message: "Lista atualizada com sucesso." });
}

// Remove uma lista.
export async function deleteListController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  await listService.remove(req.params.id, requireUserId(req));
  res.json({ data: null, message: "Lista removida com sucesso." });
}

// Adiciona um item à lista.
export async function addItemController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const input = listItemBodySchema.parse(req.body);
  const list = await listService.addItem(req.params.id, requireUserId(req), input);
  res.status(201).json({ data: list, message: "Item adicionado com sucesso." });
}

// Edita um item da lista.
export async function updateItemController(
  req: Request<{ id: string; itemId: string }>,
  res: Response,
): Promise<void> {
  const input = listItemBodySchema.parse(req.body);
  const list = await listService.updateItem(req.params.id, requireUserId(req), req.params.itemId, input);
  res.json({ data: list, message: "Item atualizado com sucesso." });
}

// Remove um item da lista.
export async function deleteItemController(
  req: Request<{ id: string; itemId: string }>,
  res: Response,
): Promise<void> {
  const list = await listService.removeItem(req.params.id, requireUserId(req), req.params.itemId);
  res.json({ data: list, message: "Item removido com sucesso." });
}

// Reordena os itens da lista.
export async function reorderItemsController(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  const input = reorderSchema.parse(req.body);
  const list = await listService.reorder(req.params.id, requireUserId(req), input);
  res.json({ data: list, message: "Itens reordenados com sucesso." });
}
