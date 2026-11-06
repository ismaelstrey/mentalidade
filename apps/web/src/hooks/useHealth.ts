import type { ApiResponse } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

/** Estado retornado pelo endpoint de saúde da API. */
export interface HealthStatus {
  status: string;
  uptime: number;
  timestamp: string;
}

// Consulta o status de funcionamento da API.
export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async (): Promise<ApiResponse<HealthStatus>> => {
      const response = await api.get<ApiResponse<HealthStatus>>("/health");
      return response.data;
    },
  });
}
