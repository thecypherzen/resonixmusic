const isDevelopment = process.env.NODE_ENV === "development"

export const API_URL = isDevelopment ? import.meta.env.VITE_DEV_API_URL : import.meta.env.VITE_PROD_API_URL


export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY: '/verify',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  LOGOUT: '/logout'
};