import type { ApiResponse, RankingEntry } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta o ranking de contribuição da comunidade.
export function useRanking() {
  return useQuery({
    queryKey: ["ranking"],
    queryFn: async (): Promise<RankingEntry[]> => {
      const response = await api.get<ApiResponse<RankingEntry[]>>("/gamification/ranking");
      return response.data.data;
    },
  });
}
