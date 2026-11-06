import type { ApiResponse, GoalDto } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta as metas do usuário autenticado.
export function useGoals() {
  return useQuery({
    queryKey: ["goals"],
    queryFn: async (): Promise<GoalDto[]> => {
      const response = await api.get<ApiResponse<GoalDto[]>>("/goals");
      return response.data.data;
    },
  });
}
