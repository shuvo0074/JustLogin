import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '../types/auth';

// API service with real API calls
class AuthService {
  private baseUrl = 'http://localhost:3000';
  // private baseUrl = 'https://new-jnssk5hb0-avishek-barmans-projects.vercel.app';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  // Simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
      });

      console.log(response, "=--==--=");


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract user data and token from API response
      const user: User = {
        id: data.data.id || data.data.user_id || Date.now().toString(),
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
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  // Login user with real API call
  async loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      console.log(response, "Login response");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract token from login response
      const token = data.data.token || data.token || `jwt_token_${Date.now()}`;

      // Store token first
      await this.storeToken(token);

      // Sync user data from profile API
      let user: User;
      try {
        console.log('Syncing user data from profile API after login...');
        const profileResponse = await fetch(`${this.baseUrl}/users/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Profile sync response:', profileResponse);

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          console.log('Profile sync data:', profileData);

          // Extract user data from profile API response
          user = {
            id: profileData.data.id || profileData.data.user_id || Date.now().toString(),
            email: profileData.data.email || credentials.email,
            name: profileData.data.name || 'User',
            createdAt: profileData.data.created_at || new Date().toISOString(),
            updatedAt: profileData.data.updated_at || new Date().toISOString(),
          };
        } else {
          console.warn('Profile sync failed, using login response data');
          // Fallback to login response data if profile sync fails
          user = {
            id: data.data.id || data.data.user_id || Date.now().toString(),
            email: data.data.email || credentials.email,
            name: data.data.name || 'User',
            createdAt: data.data.created_at || new Date().toISOString(),
            updatedAt: data.data.updated_at || new Date().toISOString(),
          };
        }
      } catch (profileError) {
        console.warn('Profile sync error, using login response data:', profileError);
        // Fallback to login response data if profile sync fails
        user = {
          id: data.data.id || data.data.user_id || Date.now().toString(),
          email: data.data.email || credentials.email,
          name: data.data.name || 'User',
          createdAt: data.data.created_at || new Date().toISOString(),
          updatedAt: data.data.updated_at || new Date().toISOString(),
        };
      }

      const authResponse: AuthResponse = {
        user,
        token,
      };

      // Store user data
      await this.storeUser(user);

      return authResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
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

      // Fetch user profile from API
      const response = await fetch(`${this.baseUrl}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Profile API response:', response);

      if (!response.ok) {
        console.error('Profile API error:', response.status, response.statusText);
        // If API fails, fall back to stored user data
        const storedUser = await this.getStoredUser();
        return storedUser;
      }

      const data = await response.json();
      console.log('Profile API data:', data);

      // Extract user data from API response
      const user: User = {
        id: data.data.id || data.data.user_id || Date.now().toString(),
        email: data.data.email || '',
        name: data.data.name || 'User',
        createdAt: data.data.created_at || new Date().toISOString(),
        updatedAt: data.data.updated_at || new Date().toISOString(),
      };

      // Update stored user data with fresh data from API
      await this.storeUser(user);

      return user;
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