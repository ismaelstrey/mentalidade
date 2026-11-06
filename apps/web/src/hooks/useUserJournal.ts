import type { ApiResponse, JournalFeedItem } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta as reflexões públicas do diário de um usuário.
export function useUserJournal(username: string) {
  return useQuery({
    queryKey: ["user-journal", username],
    queryFn: async (): Promise<JournalFeedItem[]> => {
      const response = await api.get<ApiResponse<JournalFeedItem[]>>(`/users/${username}/journal`);
      return response.data.data;
    },
    enabled: username.length > 0,
  });
}
