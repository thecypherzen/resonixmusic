// frontend/src/constants/config.js
const isDevelopment = import.meta.env.MODE === "development";

export const API_BASE_URL = isDevelopment 
  ? import.meta.env.VITE_DEV_API_URL 
  : import.meta.env.VITE_PROD_API_URL;

// Add a debug log to verify the environment and URL
console.log('Environment:', import.meta.env.MODE);
console.log('API URL:', API_BASE_URL);

export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY: '/verify',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  LOGOUT: '/logout'
};