import { apiClient, ApiClientError } from "./api";
import { config } from "@/config/env";

export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: {
    street: string;
    neighborhood: string;
    number: string;
    city: string;
    state: string;
    cep: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

function mapUser(rawUser: any): User {
  return {
    id: rawUser.id || rawUser._id,
    email: rawUser.email,
    fullName: rawUser.nome || rawUser.fullName || "",
    createdAt: rawUser.createdAt,
  };
}


export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    // Validate passwords match on frontend
    if (data.password !== data.confirmPassword) {
      throw new AuthError("As senhas não coincidem");
    }

    if (data.password.length < 6) {
      throw new AuthError("A senha deve ter pelo menos 6 caracteres");
    }

    try {
      // Prepare data for backend
      const registerPayload = {
        nome: data.fullName,
        email: data.email,
        password: data.password,
        cep: data.address.cep.replace(/\D/g, ""),
        numero: data.address.number,
      };

      return await apiClient.post<AuthResponse>(
        config.endpoints.auth.register,
        registerPayload,
      );
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw new AuthError(error.message, error.statusCode);
      }
      throw new AuthError("Erro ao criar conta");
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      return await apiClient.post<AuthResponse>(
        config.endpoints.auth.login,
        data,
      );
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw new AuthError(error.message, error.statusCode);
      }
      throw new AuthError("Erro ao fazer login");
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post<void>(config.endpoints.auth.forgotPassword, {
        email,
      });
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw new AuthError(error.message, error.statusCode);
      }
      throw new AuthError("Erro ao enviar e-mail de recuperação");
    }
  },

 async verifyToken(token: string): Promise<User | null> {
  try {
    const currentToken = localStorage.getItem("auth_token");
    localStorage.setItem("auth_token", token);

    const rawUser = await apiClient.get<any>(config.endpoints.auth.profile);

    if (currentToken) {
      localStorage.setItem("auth_token", currentToken);
    } else {
      localStorage.removeItem("auth_token");
    }

    return mapUser(rawUser);
  } catch {
    return null;
  }
},

  async refreshToken(): Promise<AuthResponse> {
    try {
      return await apiClient.post<AuthResponse>(config.endpoints.auth.refresh);
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw new AuthError(error.message, error.statusCode);
      }
      throw new AuthError("Erro ao atualizar token");
    }
  },

  logout(): void {
    localStorage.removeItem("auth_token");
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      return await apiClient.get<User>(config.endpoints.auth.profile);
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw new AuthError(error.message, error.statusCode);
      }
      throw new AuthError("Erro ao carregar perfil");
    }
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      return await apiClient.patch<User>(config.endpoints.auth.profile, data);
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw new AuthError(error.message, error.statusCode);
      }
      throw new AuthError("Erro ao atualizar perfil");
    }
  },
};
