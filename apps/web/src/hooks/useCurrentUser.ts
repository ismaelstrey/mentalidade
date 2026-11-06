import type { ApiResponse, AuthUser } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta os dados do usuário autenticado a partir do token salvo.
export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async (): Promise<AuthUser> => {
      const response = await api.get<ApiResponse<AuthUser>>("/auth/me");
      return response.data.data;
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
