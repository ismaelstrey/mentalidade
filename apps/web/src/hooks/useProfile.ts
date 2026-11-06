import type { ApiResponse, PublicProfile } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta o perfil público de um usuário pelo nome de usuário.
export function useProfile(username: string) {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: async (): Promise<PublicProfile> => {
      const response = await api.get<ApiResponse<PublicProfile>>(`/users/${username}`);
      return response.data.data;
    },
    enabled: username.length > 0,
  });
}
