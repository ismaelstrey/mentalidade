import type { ApiResponse, CommentDto } from "@mentalidade/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

// Publica um comentário em uma lista.
export function useCreateComment(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string): Promise<CommentDto> => {
      const response = await api.post<ApiResponse<CommentDto>>(`/lists/${listId}/comments`, {
        content,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", listId] });
    },
  });
}

// Remove um comentário de uma lista.
export function useDeleteComment(listId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string): Promise<void> => {
      await api.delete(`/lists/${listId}/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", listId] });
    },
  });
}
