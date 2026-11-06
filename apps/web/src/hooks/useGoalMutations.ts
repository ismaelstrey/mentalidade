import type {
  ApiResponse,
  CreateGoalRequest,
  GoalDto,
  UpdateGoalRequest,
  UpdateMilestoneRequest,
} from "@mentalidade/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

// Invalida o cache das metas após uma alteração.
function useInvalidateGoals() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["goals"] });
  };
}

// Cria uma nova meta.
export function useCreateGoal() {
  const invalidate = useInvalidateGoals();

  return useMutation({
    mutationFn: async (input: CreateGoalRequest): Promise<GoalDto> => {
      const response = await api.post<ApiResponse<GoalDto>>("/goals", input);
      return response.data.data;
    },
    onSuccess: invalidate,
  });
}

// Atualiza uma meta existente.
export function useUpdateGoal(id: string) {
  const invalidate = useInvalidateGoals();

  return useMutation({
    mutationFn: async (input: UpdateGoalRequest): Promise<GoalDto> => {
      const response = await api.put<ApiResponse<GoalDto>>(`/goals/${id}`, input);
      return response.data.data;
    },
    onSuccess: invalidate,
  });
}

// Remove uma meta existente.
export function useDeleteGoal() {
  const invalidate = useInvalidateGoals();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/goals/${id}`);
    },
    onSuccess: invalidate,
  });
}

// Adiciona um marco a uma meta.
export function useAddMilestone(id: string) {
  const invalidate = useInvalidateGoals();

  return useMutation({
    mutationFn: async (title: string): Promise<GoalDto> => {
      const response = await api.post<ApiResponse<GoalDto>>(`/goals/${id}/milestones`, { title });
      return response.data.data;
    },
    onSuccess: invalidate,
  });
}

// Atualiza um marco de uma meta.
export function useUpdateMilestone(id: string) {
  const invalidate = useInvalidateGoals();

  return useMutation({
    mutationFn: async (input: { milestoneId: string; data: UpdateMilestoneRequest }): Promise<GoalDto> => {
      const response = await api.put<ApiResponse<GoalDto>>(
        `/goals/${id}/milestones/${input.milestoneId}`,
        input.data,
      );
      return response.data.data;
    },
    onSuccess: invalidate,
  });
}

// Remove um marco de uma meta.
export function useDeleteMilestone(id: string) {
  const invalidate = useInvalidateGoals();

  return useMutation({
    mutationFn: async (milestoneId: string): Promise<GoalDto> => {
      const response = await api.delete<ApiResponse<GoalDto>>(`/goals/${id}/milestones/${milestoneId}`);
      return response.data.data;
    },
    onSuccess: invalidate,
  });
}
