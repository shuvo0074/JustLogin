import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, ENVIRONMENT } from '../config/env';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '../types/auth';

// API service with real API calls
class AuthService {
  private baseUrl = API_BASE_URL;
  // private baseUrl = 'https://new-jnssk5hb0-avishek-barmans-projects.vercel.app';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  constructor() {
    // Log the runtime API base URL so we can verify what the app will talk to
    try {
      console.log('[AuthService] runtime API_BASE_URL =', this.baseUrl, ENVIRONMENT);
    } catch (e) {
      // swallow any logging errors to avoid crashing startup
    }
  }

  // Store token in AsyncStorage
  private async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.tokenKey, token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  // Get token from storage
  private async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.tokenKey);
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  // Store user data
  private async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.userKey, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
    }
  }

  // Get stored user data
  private async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.userKey);
      if (userData) {
        return JSON.parse(userData) as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  // Clear stored data
  private async clearStoredData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.tokenKey, this.userKey]);
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  }

  // Register user with real API call
  async register(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      // Validate credentials
      if (!credentials.email || !credentials.password || !credentials.name) {
        throw new Error('Email, password, and name are required');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          name: credentials.name,
          role: credentials.role,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Extract user data and token from API response
      const user: User = {
        id: data.data.id || data.data.user_id || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: data.data.email || credentials.email,
        name: data.data.name || credentials.name,
        createdAt: data.data.created_at || new Date().toISOString(),
        updatedAt: data.data.updated_at || new Date().toISOString(),
      };

      const token = data.data.token || data.token || `jwt_token_${Date.now()}`;

      const authResponse: AuthResponse = {
        user,
        token,
      };

      // Store authentication data
      await this.storeToken(token);
      await this.storeUser(user);

      return authResponse;
    } catch (error) {
      console.error('Registration error:', error);

      // Handle different types of errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your internet connection.');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Unable to connect to server. Please check your network connection.');
        }
        throw new Error(error.message);
      }

      throw new Error('Registration failed. Please try again.');
    }
  }

  // Login user with real API call
  async loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Validate credentials
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
        signal: controller.signal,
      });
      const data = await response.json()

      console.log(data, "===");

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      // Extract token from login response
      const token = data.data.token || data.token || `jwt_token_${Date.now()}`;

      // Store token first
      await this.storeToken(token);

      // Extract user data directly from login response
      const user: User = {
        id: data.data.user?.id || data.data.id || Date.now().toString(),
        email: data.data.user?.email || data.data.email || credentials.email,
        name: data.data.user?.name || data.data.name || 'User',
        createdAt: data.data.user?.created_at || data.data.created_at || new Date().toISOString(),
        updatedAt: data.data.user?.updated_at || data.data.updated_at || new Date().toISOString(),
      };

      console.log('User data from login response:', user);

      const authResponse: AuthResponse = {
        user,
        token,
      };

      // Store user data
      await this.storeUser(user);

      return authResponse;
    } catch (error) {
      console.error('Login error:', error);

      // Handle different types of errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your internet connection.');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Unable to connect to server. Please check your network connection.');
        }
        throw new Error(error.message);
      }

      throw new Error('Login failed. Please try again.');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Use the real API login method
      return await this.loginUser(credentials);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      // Ensure role is always "member" for signup
      const signupData: SignupCredentials = {
        ...credentials,
        role: 'member',
      };

      // Use the real API register method
      return await this.register(signupData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Signup failed');
    }
  }

  async logout(): Promise<void> {
    try {
      // Simulate API call
      await this.delay(500);

      // Clear stored data
      await this.clearStoredData();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear stored data even if API call fails
      await this.clearStoredData();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await this.getStoredToken();

      if (!token) {
        return null;
      }

      // Return stored user data since profile API is not available
      const storedUser = await this.getStoredUser();
      console.log('Returning stored user data:', storedUser);
      return storedUser;
    } catch (error) {
      console.error('Get current user error:', error);
      // If API fails, fall back to stored user data
      try {
        const storedUser = await this.getStoredUser();
        return storedUser;
      } catch (fallbackError) {
        console.error('Fallback to stored user failed:', fallbackError);
        return null;
      }
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const token = await this.getStoredToken();
      return !!token;
    } catch (error) {
      console.error('Validate token error:', error);
      return false;
    }
  }
}

export const authService = new AuthService(); 