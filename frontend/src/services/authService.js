import axios from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../constants/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async verifyToken() {
    try {
      const response = await api.get(AUTH_ENDPOINTS.VERIFY);
      return response.data;
    } catch (error) {
      this.logout();
      throw new Error('Token verification failed');
    }
  }

  async forgotPassword(email) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  async logout() {
    try {
      await api.post(AUTH_ENDPOINTS.LOGOUT);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();