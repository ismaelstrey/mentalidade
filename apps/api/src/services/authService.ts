import type { AuthResponse, AuthUser } from "@mentalidade/shared";
import bcrypt from "bcrypt";
import { userRepository } from "../repositories/userRepository";
import { AppError } from "../utils/AppError";
import { signToken } from "../utils/jwt";
import { toAuthUser } from "../utils/userMapper";
import type { LoginInput, RegisterInput } from "../validators/authValidator";

// Quantidade de rounds usada para gerar o hash das senhas.
const SALT_ROUNDS = 10;

// Serviço responsável pelo cadastro e autenticação de usuários.
export const authService = {
  // Cadastra um novo usuário e devolve o token de acesso.
  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingEmail = await userRepository.findByEmail(input.email);
    if (existingEmail) {
      throw new AppError("E-mail já cadastrado.", 409);
    }

    const existingUsername = await userRepository.findByUsername(input.username);
    if (existingUsername) {
      throw new AppError("Nome de usuário já está em uso.", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const user = await userRepository.create({
      name: input.name,
      username: input.username,
      email: input.email,
      passwordHash,
    });

    const token = signToken({ sub: user.id, username: user.username });

    return { token, user: toAuthUser(user) };
  },

  // Autentica um usuário existente e devolve o token de acesso.
  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    const token = signToken({ sub: user.id, username: user.username });

    return { token, user: toAuthUser(user) };
  },

  // Retorna os dados do usuário autenticado.
  async getAuthenticatedUser(userId: string): Promise<AuthUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    return toAuthUser(user);
  },
};
