// Chave usada para guardar o token de acesso no navegador.
const TOKEN_KEY = "mentalidade:token";

// Recupera o token de acesso salvo no navegador.
export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Salva o token de acesso no navegador.
export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

// Remove o token de acesso salvo no navegador.
export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
