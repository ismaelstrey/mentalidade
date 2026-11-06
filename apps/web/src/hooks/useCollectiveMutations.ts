import type { ApiResponse, LikeState, ListDetail } from "@mentalidade/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

// Importa (fork) uma lista pública para o acervo do usuário.
export function useForkList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<ListDetail> => {
      const response = await api.post<ApiResponse<ListDetail>>(`/lists/${id}/fork`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["discover"] });
    },
  });
}

// Alterna a curtida do usuário em uma lista.
export function useToggleLike(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<LikeState> => {
      const response = await api.post<ApiResponse<LikeState>>(`/lists/${listId}/like`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list", listId] });
      queryClient.invalidateQueries({ queryKey: ["discover"] });
    },
  });
}
