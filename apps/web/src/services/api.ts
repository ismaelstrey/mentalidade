import axios from "axios";
import { clearStoredToken, getStoredToken } from "../utils/tokenStorage";

// Instância única do axios usada para acessar a API.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333/api",
});

// Anexa o token de acesso em todas as requisições.
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Descarta o token quando a API responde com erro de autenticação.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearStoredToken();
    }
    return Promise.reject(error);
  },
);
