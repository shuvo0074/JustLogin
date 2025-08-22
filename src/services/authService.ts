import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '../types/auth';
import { biometricAuthService } from './biometricAuthService';

// Mock API service - replace with actual API calls
class AuthService {
  private baseUrl = 'https://api.example.com/auth'; // Replace with your actual API URL
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

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulate API call
      await this.delay(1000);

      // Mock validation
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: 'Test User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const mockToken = 'mock_jwt_token_' + Date.now();

        const response: AuthResponse = {
          user: mockUser,
          token: mockToken,
        };

        // Store authentication data
        await this.storeToken(mockToken);
        await this.storeUser(mockUser);

        return response;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      // Simulate API call
      await this.delay(1000);

      // Mock user creation
      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      const response: AuthResponse = {
        user: mockUser,
        token: mockToken,
      };

      // Store authentication data
      await this.storeToken(mockToken);
      await this.storeUser(mockUser);

      return response;
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
      const user = await this.getStoredUser();

      if (token && user) {
        // In a real app, you might want to validate the token with the server
        return user;
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
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

  /**
   * Login using biometric authentication
   */
  async loginWithBiometrics(): Promise<AuthResponse> {
    try {
      // First, authenticate with biometrics
      const biometricResult = await biometricAuthService.authenticate();
      
      if (!biometricResult.success) {
        throw new Error('Biometric authentication failed');
      }
      
      // If biometrics succeed, proceed with login using stored credentials
      const storedUser = await this.getStoredUser();
      const storedToken = await this.getStoredToken();
      
      if (storedUser && storedToken) {
        return {
          user: storedUser,
          token: storedToken,
        };
      } else {
        throw new Error('No stored credentials found. Please login with email/password first.');
      }
    } catch (error) {
      throw new Error(`Biometric login failed: ${error}`);
    }
  }

  /**
   * Check if biometric authentication is available
   */
  async isBiometricsAvailable(): Promise<boolean> {
    return await biometricAuthService.checkAvailability();
  }

  /**
   * Get supported biometric types
   */
  async getSupportedBiometricTypes(): Promise<string[]> {
    return await biometricAuthService.getSupportedTypes();
  }
}

export const authService = new AuthService(); 