import type { ApiResponse, CreateListRequest, ListDetail, UpdateListRequest } from "@mentalidade/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

// Cria uma nova lista.
export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateListRequest): Promise<ListDetail> => {
      const response = await api.post<ApiResponse<ListDetail>>("/lists", input);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}

// Atualiza uma lista existente.
export function useUpdateList(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateListRequest): Promise<ListDetail> => {
      const response = await api.put<ApiResponse<ListDetail>>(`/lists/${id}`, input);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["list", id] });
    },
  });
}

// Remove uma lista existente.
export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/lists/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
}
