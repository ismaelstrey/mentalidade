import type { ApiResponse, JournalEntryDto } from "@mentalidade/shared";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

// Consulta as reflexões do diário do usuário autenticado.
export function useJournal() {
  return useQuery({
    queryKey: ["journal"],
    queryFn: async (): Promise<JournalEntryDto[]> => {
      const response = await api.get<ApiResponse<JournalEntryDto[]>>("/journal");
      return response.data.data;
    },
  });
}
