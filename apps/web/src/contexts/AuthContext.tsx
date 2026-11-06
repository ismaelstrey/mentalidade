import type { AuthUser, LoginRequest, RegisterRequest } from "@mentalidade/shared";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useLogin } from "../hooks/useLogin";
import { useRegister } from "../hooks/useRegister";
import { clearStoredToken, getStoredToken, setStoredToken } from "../utils/tokenStorage";

// Chave da consulta com os dados do usuário autenticado.
const CURRENT_USER_QUERY_KEY = ["auth", "me"];

// Valores disponibilizados pelo contexto de autenticação.
export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginRequest) => Promise<void>;
  register: (input: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// Contexto com o estado de autenticação da aplicação.
export const AuthContext = createContext<AuthContextValue | null>(null);

// Provedor que mantém o usuário autenticado disponível para toda a aplicação.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const currentUserQuery = useCurrentUser(Boolean(token));

  // Autentica o usuário e guarda o token de acesso.
  const login = useCallback(
    async (input: LoginRequest): Promise<void> => {
      const result = await loginMutation.mutateAsync(input);
      setStoredToken(result.token);
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, result.user);
      setToken(result.token);
    },
    [loginMutation, queryClient],
  );

  // Cadastra o usuário e guarda o token de acesso.
  const register = useCallback(
    async (input: RegisterRequest): Promise<void> => {
      const result = await registerMutation.mutateAsync(input);
      setStoredToken(result.token);
      queryClient.setQueryData(CURRENT_USER_QUERY_KEY, result.user);
      setToken(result.token);
    },
    [registerMutation, queryClient],
  );

  // Encerra a sessão do usuário.
  const logout = useCallback((): void => {
    clearStoredToken();
    setToken(null);
    queryClient.removeQueries({ queryKey: ["auth"] });
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: currentUserQuery.data ?? null,
      isLoading: Boolean(token) && currentUserQuery.isLoading,
      isAuthenticated: currentUserQuery.isSuccess,
      login,
      register,
      logout,
    }),
    [
      currentUserQuery.data,
      currentUserQuery.isLoading,
      currentUserQuery.isSuccess,
      token,
      login,
      register,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
