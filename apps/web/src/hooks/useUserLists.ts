import type { ApiResponse, ListCard } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta as listas públicas de um usuário pelo nome de usuário.
export function useUserLists(username: string) {
  return useQuery({
    queryKey: ["user-lists", username],
    queryFn: async (): Promise<ListCard[]> => {
      const response = await api.get<ApiResponse<ListCard[]>>(`/users/${username}/lists`);
      return response.data.data;
    },
    enabled: username.length > 0,
  });
}
