import type { ApiResponse, LinkPreview } from "@mentalidade/shared";
import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

// Detecta plataforma e metadados de um link de vídeo.
export function useLinkPreview() {
  return useMutation({
    mutationFn: async (url: string): Promise<LinkPreview> => {
      const response = await api.post<ApiResponse<LinkPreview>>("/links/preview", { url });
      return response.data.data;
    },
  });
}
