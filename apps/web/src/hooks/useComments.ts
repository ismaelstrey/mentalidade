import type { ApiResponse, CommentDto } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta os comentários de uma lista.
export function useComments(listId: string) {
  return useQuery({
    queryKey: ["comments", listId],
    queryFn: async (): Promise<CommentDto[]> => {
      const response = await api.get<ApiResponse<CommentDto[]>>(`/lists/${listId}/comments`);
      return response.data.data;
    },
    enabled: listId.length > 0,
  });
}
