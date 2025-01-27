import axios from 'axios';
import { API_URL, AUTH_ENDPOINTS } from '../constants/config';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

class AuthService {
  constructor() {
    this.tokenRefreshTimeout = null;
  }

  initiateLogin() {
    // Instead of making an XHR request, redirect the window
    window.location.href = `${API_URL}${AUTH_ENDPOINTS.LOGIN}`;
  }

  isAuthenticated() {
    const authData = localStorage.getItem('auth_data');
    if (!authData) return false;
    
    try {
      const { expiresAt } = JSON.parse(authData);
      return Date.now() < expiresAt;
    } catch {
      return false;
    }
  }

  async checkAuthStatus() {
    try {
      const authData = localStorage.getItem('auth_data');
      if (!authData) return { isAuthenticated: false };

      const parsedData = JSON.parse(authData);
      if (Date.now() >= parsedData.expiresAt) {
        localStorage.removeItem('auth_data');
        return { isAuthenticated: false };
      }

      return {
        isAuthenticated: true,
        user: parsedData
      };
    } catch (error) {
      console.error('Check auth status failed:', error);
      return { isAuthenticated: false };
    }
  }

  setTokenRefreshTimeout(expiresIn) {
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }
    const refreshTime = (expiresIn - 300) * 1000; // 5 minutes before expiration
    this.tokenRefreshTimeout = setTimeout(() => this.refreshToken(), refreshTime);
  }

  async refreshToken() {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.headers.status === 'success' && data.results?.[0]) {
        return this.handleAuthData(data.results[0]);
      }
      throw new Error('Token refresh failed');
    } catch (error) {
      localStorage.removeItem('auth_data');
      throw error;
    }
  }

  handleAuthData(authData) {
    const { access_token, expires_in, scope, token_type } = authData;
    
    const userData = {
      accessToken: access_token,
      tokenType: token_type,
      scope: scope,
      expiresAt: Date.now() + (expires_in * 1000)
    };

    localStorage.setItem('auth_data', JSON.stringify(userData));
    this.setTokenRefreshTimeout(expires_in);

    return {
      isAuthenticated: true,
      user: userData
    };
  }

  logout() {
    localStorage.removeItem('auth_data');
    if (this.tokenRefreshTimeout) {
      clearTimeout(this.tokenRefreshTimeout);
    }
    window.location.href = `${API_BASE_URL}${AUTH_ENDPOINTS.LOGOUT}`;
  }
}

export default new AuthService();