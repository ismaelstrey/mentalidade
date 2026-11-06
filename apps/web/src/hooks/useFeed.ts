import type { ApiResponse, FeedItem } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta o feed de atividades recentes da comunidade.
export function useFeed() {
  return useQuery({
    queryKey: ["feed"],
    queryFn: async (): Promise<FeedItem[]> => {
      const response = await api.get<ApiResponse<FeedItem[]>>("/gamification/feed");
      return response.data.data;
    },
  });
}
