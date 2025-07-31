const inDevMode = import.meta.env.VITE_ENV === "dev";

export const API_BASE_URL = inDevMode
  ? import.meta.env.VITE_DEV_BE_BASE_URL
  : import.meta.env.VITE_PROD_BE_BASE_URL;

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY: "/auth/verify",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  LOGOUT: "/auth/logout",
};
