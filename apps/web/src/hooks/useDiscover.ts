import type { ApiResponse, DiscoverQuery, ListCard, Paginated } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta listas públicas aplicando filtros e ordenação.
export function useDiscover(query: DiscoverQuery) {
  return useQuery({
    queryKey: ["discover", query],
    queryFn: async (): Promise<Paginated<ListCard>> => {
      const response = await api.get<ApiResponse<Paginated<ListCard>>>("/lists/discover", {
        params: query,
      });
      return response.data.data;
    },
  });
}
