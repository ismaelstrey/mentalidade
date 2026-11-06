import type {
  ApiResponse,
  CreateHabitRequest,
  HabitCheckinRequest,
  HabitDto,
  UpdateHabitRequest,
} from "@mentalidade/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

// Cria um novo hábito.
export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateHabitRequest): Promise<HabitDto> => {
      const response = await api.post<ApiResponse<HabitDto>>("/habits", input);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// Atualiza um hábito existente.
export function useUpdateHabit(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateHabitRequest): Promise<HabitDto> => {
      const response = await api.put<ApiResponse<HabitDto>>(`/habits/${id}`, input);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// Remove um hábito existente.
export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/habits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// Registra o check-in de um hábito.
export function useHabitCheckin(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: HabitCheckinRequest): Promise<HabitDto> => {
      const response = await api.post<ApiResponse<HabitDto>>(`/habits/${id}/checkin`, input);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}

// Remove o check-in de um hábito.
export function useHabitUncheckin(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: HabitCheckinRequest): Promise<HabitDto> => {
      const response = await api.delete<ApiResponse<HabitDto>>(`/habits/${id}/checkin`, { data: input });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });
}
