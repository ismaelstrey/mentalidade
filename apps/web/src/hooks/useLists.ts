import type { ApiResponse, ListSummary } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta as listas do usuário autenticado.
export function useLists() {
  return useQuery({
    queryKey: ["lists"],
    queryFn: async (): Promise<ListSummary[]> => {
      const response = await api.get<ApiResponse<ListSummary[]>>("/lists");
      return response.data.data;
    },
  });
}
