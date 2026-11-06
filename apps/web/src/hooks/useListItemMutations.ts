import type {
  ApiResponse,
  ListDetail,
  ListItemRequest,
  ReorderItemsRequest,
} from "@mentalidade/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

// Adiciona um item à lista.
export function useAddListItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ListItemRequest): Promise<ListDetail> => {
      const response = await api.post<ApiResponse<ListDetail>>(`/lists/${listId}/items`, input);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list", listId] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

// Edita um item da lista.
export function useUpdateListItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ListItemRequest & { itemId: string }): Promise<ListDetail> => {
      const { itemId, ...body } = input;
      const response = await api.put<ApiResponse<ListDetail>>(
        `/lists/${listId}/items/${itemId}`,
        body,
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list", listId] });
    },
  });
}

// Remove um item da lista.
export function useDeleteListItem(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string): Promise<ListDetail> => {
      const response = await api.delete<ApiResponse<ListDetail>>(`/lists/${listId}/items/${itemId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list", listId] });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

// Reordena os itens da lista.
export function useReorderListItems(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ReorderItemsRequest): Promise<ListDetail> => {
      const response = await api.put<ApiResponse<ListDetail>>(`/lists/${listId}/reorder`, input);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list", listId] });
    },
  });
}
