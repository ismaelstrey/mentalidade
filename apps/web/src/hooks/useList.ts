import type { ApiResponse, ListDetail } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta o detalhe de uma lista pelo identificador.
export function useList(id: string) {
  return useQuery({
    queryKey: ["list", id],
    queryFn: async (): Promise<ListDetail> => {
      const response = await api.get<ApiResponse<ListDetail>>(`/lists/${id}`);
      return response.data.data;
    },
    enabled: id.length > 0,
  });
}
