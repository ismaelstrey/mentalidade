// Usuário autenticado injetado na requisição pelo middleware de autenticação.
export interface AuthenticatedUser {
  id: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
