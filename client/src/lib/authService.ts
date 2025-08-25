// Authentication service for handling login/signup
import { API_BASE_URL } from './api';

export interface AuthResponse {
  success: boolean;
  message?: string;
  redirectUrl?: string;
}

export class AuthService {
  static async login(): Promise<AuthResponse> {
    try {
      // For now, we'll redirect to the backend login endpoint
      // In production, this should handle the OAuth flow properly
      const loginUrl = `${API_BASE_URL}/api/login`;
      window.location.href = loginUrl;
      return { success: true, redirectUrl: loginUrl };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Failed to initiate login. Please try again.' 
      };
    }
  }

  static async signup(): Promise<AuthResponse> {
    try {
      // For now, signup uses the same login flow
      // In a real app, you might have a separate signup endpoint
      const signupUrl = `${API_BASE_URL}/api/login`;
      window.location.href = signupUrl;
      return { success: true, redirectUrl: signupUrl };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        message: 'Failed to initiate signup. Please try again.' 
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      const logoutUrl = `${API_BASE_URL}/api/logout`;
      window.location.href = logoutUrl;
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: just redirect to home
      window.location.href = '/';
    }
  }

  static async checkAuthStatus(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
        credentials: 'include',
      });
      return response.ok;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  }
}
