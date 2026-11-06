import type { ApiResponse, FollowState } from "@mentalidade/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta o estado de seguimento do usuário atual sobre um perfil.
export function useFollowState(username: string) {
  return useQuery({
    queryKey: ["follow", username],
    queryFn: async (): Promise<FollowState> => {
      const response = await api.get<ApiResponse<FollowState>>(`/users/${username}/follow`);
      return response.data.data;
    },
    enabled: username.length > 0,
  });
}

// Alterna o seguimento de um perfil.
export function useToggleFollow(username: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<FollowState> => {
      const response = await api.post<ApiResponse<FollowState>>(`/users/${username}/follow`);
      return response.data.data;
    },
    onSuccess: (state) => {
      // Atualiza imediatamente o estado e o perfil exibido.
      queryClient.setQueryData(["follow", username], state);
      queryClient.invalidateQueries({ queryKey: ["profile", username] });
    },
  });
}
