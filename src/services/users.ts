import { apiClient, ApiClientError } from "./api";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  address?: {
    street: string;
    neighborhood: string;
    number: string;
    city: string;
    state: string;
    cep: string;
  };
}

export interface UsersListResponse {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
}

export class UsersError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "UsersError";
  }
}

export const usersService = {
  async getAllUsers(page: number = 1, limit: number = 10): Promise<UsersListResponse> {
    try {
      const response = await apiClient.get<UsersListResponse>(`/users?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw new UsersError(error.message, error.statusCode);
      }
      throw new UsersError("Erro ao carregar lista de usuários");
    }
  },

  async searchUsers(query: string): Promise<UsersListResponse> {
    try {
      const response = await apiClient.get<UsersListResponse>(`/users/search?q=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw new UsersError(error.message, error.statusCode);
      }
      throw new UsersError("Erro ao buscar usuários");
    }
  },
};
