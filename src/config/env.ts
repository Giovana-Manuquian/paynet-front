export const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  APP_NAME: "PayAuth",
  APP_VERSION: "1.0.0",
  ENVIRONMENT: import.meta.env.MODE || "development",

  resetPassword: "/auth/reset-password",
  verifyResetToken: "/auth/verify-reset-token",

  // Adicionar nova seção:
  users: {
    list: "/users",
    search: "/users/search",
  },

  // API Endpoints
  endpoints: {
    auth: {
      login: "/auth/login",
      register: "/auth/register",
      logout: "/auth/logout",
      profile: "/auth/profile",
      forgotPassword: "/auth/forgot-password",
      refresh: "/auth/refresh",
    },
  },
} as const;

export type Config = typeof config;
