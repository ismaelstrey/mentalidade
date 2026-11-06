import type { ApiResponse, AuthResponse, LoginRequest } from "@mentalidade/shared";
import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

// Autentica o usuário na API.
export function useLogin() {
  return useMutation({
    mutationFn: async (input: LoginRequest): Promise<AuthResponse> => {
      const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", input);
      return response.data.data;
    },
  });
}
