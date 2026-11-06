import type { ApiResponse, Theme } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta o catálogo de temas disponíveis.
export function useThemes() {
  return useQuery({
    queryKey: ["themes"],
    queryFn: async (): Promise<Theme[]> => {
      const response = await api.get<ApiResponse<Theme[]>>("/themes");
      return response.data.data;
    },
    staleTime: Infinity,
  });
}
