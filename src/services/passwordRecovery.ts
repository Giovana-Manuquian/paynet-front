import { apiClient, ApiClientError } from "./api";

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordResponse {
  message: string;
  success: boolean;
}

export class PasswordRecoveryError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "PasswordRecoveryError";
  }
}

export const passwordRecoveryService = {
  async sendRecoveryEmail(email: string): Promise<ForgotPasswordResponse> {
    try {
      return await apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", { email });
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw new PasswordRecoveryError(error.message, error.statusCode);
      }
      throw new PasswordRecoveryError("Erro ao enviar e-mail de recuperação");
    }
  },

  async verifyResetToken(token: string): Promise<boolean> {
    try {
      // GET com token como query param
      await apiClient.get(`/auth/verify-reset-token?token=${encodeURIComponent(token)}`);
      return true;
    } catch (error) {
      return false;
    }
  },


  async resetPassword(data: ResetPasswordData): Promise<void> {
    if (data.newPassword !== data.confirmPassword) {
      throw new PasswordRecoveryError("As senhas não coincidem");
    }
    if (data.newPassword.length < 6) {
      throw new PasswordRecoveryError("A senha deve ter pelo menos 6 caracteres");
    }
    try {
      await apiClient.post("/auth/reset-password", {
        token: data.token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword, // <-- Adicionado aqui!
      });
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw new PasswordRecoveryError(error.message, error.statusCode);
      }
      throw new PasswordRecoveryError("Erro ao redefinir senha");
    }
  },
};
