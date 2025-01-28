const isDevelopment = import.meta.env.MODE === "development";

export const API_BASE_URL = isDevelopment 
  ? import.meta.env.VITE_DEV_API_URL 
  : import.meta.env.VITE_PROD_API_URL;

export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  VERIFY: '/api/auth/verify',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  LOGOUT: '/api/auth/logout'
};