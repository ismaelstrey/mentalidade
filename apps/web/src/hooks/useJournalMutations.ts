import type {
  ApiResponse,
  CreateJournalEntryRequest,
  JournalEntryDto,
  UpdateJournalEntryRequest,
} from "@mentalidade/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

// Invalida o cache do diário após uma alteração.
function useInvalidateJournal() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["journal"] });
    queryClient.invalidateQueries({ queryKey: ["user-journal"] });
  };
}

// Cria uma nova reflexão no diário.
export function useCreateJournalEntry() {
  const invalidate = useInvalidateJournal();

  return useMutation({
    mutationFn: async (input: CreateJournalEntryRequest): Promise<JournalEntryDto> => {
      const response = await api.post<ApiResponse<JournalEntryDto>>("/journal", input);
      return response.data.data;
    },
    onSuccess: invalidate,
  });
}

// Atualiza uma reflexão existente.
export function useUpdateJournalEntry(id: string) {
  const invalidate = useInvalidateJournal();

  return useMutation({
    mutationFn: async (input: UpdateJournalEntryRequest): Promise<JournalEntryDto> => {
      const response = await api.put<ApiResponse<JournalEntryDto>>(`/journal/${id}`, input);
      return response.data.data;
    },
    onSuccess: invalidate,
  });
}

// Remove uma reflexão do diário.
export function useDeleteJournalEntry() {
  const invalidate = useInvalidateJournal();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/journal/${id}`);
    },
    onSuccess: invalidate,
  });
}
