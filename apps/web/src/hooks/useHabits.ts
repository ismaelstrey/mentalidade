import type { ApiResponse, HabitDto } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta os hábitos do usuário autenticado.
export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: async (): Promise<HabitDto[]> => {
      const response = await api.get<ApiResponse<HabitDto[]>>("/habits");
      return response.data.data;
    },
  });
}
