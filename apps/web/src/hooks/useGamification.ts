import type { ApiResponse, GamificationStats } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta as estatísticas de gamificação do usuário autenticado.
export function useGamification() {
  return useQuery({
    queryKey: ["gamification"],
    queryFn: async (): Promise<GamificationStats> => {
      const response = await api.get<ApiResponse<GamificationStats>>("/gamification");
      return response.data.data;
    },
  });
}
