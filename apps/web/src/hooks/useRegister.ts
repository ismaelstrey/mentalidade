import type { ApiResponse, AuthResponse, RegisterRequest } from "@mentalidade/shared";
import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

// Cadastra um novo usuário na API.
export function useRegister() {
  return useMutation({
    mutationFn: async (input: RegisterRequest): Promise<AuthResponse> => {
      const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", input);
      return response.data.data;
    },
  });
}
