import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '../../services/authService';
import { LoginCredentials, SignupCredentials, User } from '../../types/auth';

// Mock the authService
jest.mock('../../services/authService');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

// Test component to access context
const TestComponent: React.FC = () => {
  const auth = useAuth();
  return (
    <View>
      <Text testID="user">{auth.user ? auth.user.name : 'no-user'}</Text>
      <Text testID="isAuthenticated">{auth.isAuthenticated.toString()}</Text>
      <Text testID="isLoading">{auth.isLoading.toString()}</Text>
      <Text testID="error">{auth.error || 'no-error'}</Text>
      <Text testID="loginForm">{JSON.stringify(auth.loginForm)}</Text>
      <Text testID="signupForm">{JSON.stringify(auth.signupForm)}</Text>
    </View>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AuthProvider', () => {
    it('should provide initial state correctly', async () => {
      // Mock auth service to return null immediately
      mockedAuthService.getCurrentUser.mockResolvedValue(null);

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for auth check to complete
      await waitFor(() => {
        expect(getByTestId('isLoading').props.children).toBe('false');
      });

      expect(getByTestId('user').props.children).toBe('no-user');
      expect(getByTestId('isAuthenticated').props.children).toBe('false');
      expect(getByTestId('error').props.children).toBe('no-error');
      expect(getByTestId('loginForm').props.children).toBe('{"email":"","password":""}');
      expect(getByTestId('signupForm').props.children).toBe('{"name":"","email":"","password":"","confirmPassword":""}');
    });

    it('should check auth status on mount', async () => {
      const mockUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };

      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initially should be loading
      expect(getByTestId('isLoading').props.children).toBe('true');

      // Wait for auth check to complete
      await waitFor(() => {
        expect(getByTestId('isLoading').props.children).toBe('false');
      });

      expect(getByTestId('user').props.children).toBe('Test User');
      expect(getByTestId('isAuthenticated').props.children).toBe('true');
      expect(mockedAuthService.getCurrentUser).toHaveBeenCalled();
    });

    it('should handle auth check error gracefully', async () => {
      mockedAuthService.getCurrentUser.mockRejectedValue(new Error('Auth check failed'));

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('isLoading').props.children).toBe('false');
      });

      expect(getByTestId('user').props.children).toBe('no-user');
      expect(getByTestId('isAuthenticated').props.children).toBe('false');
    });
  });

  describe('useAuth hook', () => {
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    };

    beforeEach(() => {
      mockedAuthService.login.mockResolvedValue({
        user: mockUser,
        token: 'mock-token',
      });
      mockedAuthService.signup.mockResolvedValue({
        user: mockUser,
        token: 'mock-token',
      });
      mockedAuthService.logout.mockResolvedValue();
    });

    it('should provide login functionality', async () => {
      const TestLoginComponent: React.FC = () => {
        const auth = useAuth();
        return (
          <View>
            <Text testID="user">{auth.user ? auth.user.name : 'no-user'}</Text>
            <TouchableOpacity
              testID="login-button"
              onPress={() => auth.login({ email: 'test@example.com', password: 'password123' })}
            >
              <Text>Login</Text>
            </TouchableOpacity>
          </View>
        );
      };

      const { getByTestId } = render(
        <AuthProvider>
          <TestLoginComponent />
        </AuthProvider>
      );

      expect(getByTestId('user').props.children).toBe('no-user');

      await act(async () => {
        getByTestId('login-button').props.onPress();
      });

      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('Test User');
      });

      expect(mockedAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should provide signup functionality', async () => {
      const TestSignupComponent: React.FC = () => {
        const auth = useAuth();
        return (
          <View>
            <Text testID="user">{auth.user ? auth.user.name : 'no-user'}</Text>
            <TouchableOpacity
              testID="signup-button"
              onPress={() => auth.signup({ name: 'New User', email: 'new@example.com', password: 'password123' })}
            >
              <Text>Signup</Text>
            </TouchableOpacity>
          </View>
        );
      };

      const { getByTestId } = render(
        <AuthProvider>
          <TestSignupComponent />
        </AuthProvider>
      );

      expect(getByTestId('user').props.children).toBe('no-user');

      await act(async () => {
        getByTestId('signup-button').props.onPress();
      });

      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('Test User');
      });

      expect(mockedAuthService.signup).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      });
    });

    it('should provide logout functionality', async () => {
      const TestLogoutComponent: React.FC = () => {
        const auth = useAuth();
        return (
          <View>
            <Text testID="user">{auth.user ? auth.user.name : 'no-user'}</Text>
            <TouchableOpacity testID="logout-button" onPress={() => auth.logout()}>
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        );
      };

      // First login to set up user
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByTestId } = render(
        <AuthProvider>
          <TestLogoutComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('Test User');
      });

      await act(async () => {
        getByTestId('logout-button').props.onPress();
      });

      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('no-user');
      });

      expect(mockedAuthService.logout).toHaveBeenCalled();
    });

    it('should provide form update functionality', () => {
      const TestFormComponent: React.FC = () => {
        const auth = useAuth();
        return (
          <View>
            <Text testID="loginForm">{JSON.stringify(auth.loginForm)}</Text>
            <TouchableOpacity
              testID="update-email"
              onPress={() => auth.updateLoginForm('email', 'test@example.com')}
            >
              <Text>Update Email</Text>
            </TouchableOpacity>
          </View>
        );
      };

      const { getByTestId } = render(
        <AuthProvider>
          <TestFormComponent />
        </AuthProvider>
      );

      expect(getByTestId('loginForm').props.children).toBe('{"email":"","password":""}');

      act(() => {
        getByTestId('update-email').props.onPress();
      });

      expect(getByTestId('loginForm').props.children).toBe('{"email":"test@example.com","password":""}');
    });

    it('should provide error handling', () => {
      const TestErrorComponent: React.FC = () => {
        const auth = useAuth();
        return (
          <View>
            <Text testID="error">{auth.error || 'no-error'}</Text>
            <TouchableOpacity testID="set-error" onPress={() => auth.setError('Test error')}>
              <Text>Set Error</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="clear-error" onPress={() => auth.clearError()}>
              <Text>Clear Error</Text>
            </TouchableOpacity>
          </View>
        );
      };

      const { getByTestId } = render(
        <AuthProvider>
          <TestErrorComponent />
        </AuthProvider>
      );

      expect(getByTestId('error').props.children).toBe('no-error');

      act(() => {
        getByTestId('set-error').props.onPress();
      });

      expect(getByTestId('error').props.children).toBe('Test error');

      act(() => {
        getByTestId('clear-error').props.onPress();
      });

      expect(getByTestId('error').props.children).toBe('no-error');
    });

    it('should provide password visibility functionality', () => {
      const TestPasswordComponent: React.FC = () => {
        const auth = useAuth();
        return (
          <View>
            <Text testID="passwordVisibility">{JSON.stringify(auth.passwordVisibility)}</Text>
            <TouchableOpacity testID="toggle-login" onPress={auth.toggleLoginPasswordVisibility}>
              <Text>Toggle Login</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="toggle-signup-password" onPress={() => auth.toggleSignupPasswordVisibility('password')}>
              <Text>Toggle Signup Password</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="toggle-signup-confirm" onPress={() => auth.toggleSignupPasswordVisibility('confirmPassword')}>
              <Text>Toggle Signup Confirm</Text>
            </TouchableOpacity>
          </View>
        );
      };

      const { getByTestId } = render(
        <AuthProvider>
          <TestPasswordComponent />
        </AuthProvider>
      );

      expect(getByTestId('passwordVisibility').props.children).toBe(
        '{"login":{"password":false},"signup":{"password":false,"confirmPassword":false}}'
      );

      act(() => {
        getByTestId('toggle-login').props.onPress();
      });

      expect(getByTestId('passwordVisibility').props.children).toBe(
        '{"login":{"password":true},"signup":{"password":false,"confirmPassword":false}}'
      );

      act(() => {
        getByTestId('toggle-signup-password').props.onPress();
      });

      expect(getByTestId('passwordVisibility').props.children).toBe(
        '{"login":{"password":true},"signup":{"password":true,"confirmPassword":false}}'
      );

      act(() => {
        getByTestId('toggle-signup-confirm').props.onPress();
      });

      expect(getByTestId('passwordVisibility').props.children).toBe(
        '{"login":{"password":true},"signup":{"password":true,"confirmPassword":true}}'
      );
    });
  });

  describe('Error handling', () => {
    it('should handle login errors', async () => {
      const errorMessage = 'Login failed';
      mockedAuthService.login.mockRejectedValue(new Error(errorMessage));

      const TestLoginErrorComponent: React.FC = () => {
        const auth = useAuth();
        return (
          <View>
            <Text testID="error">{auth.error || 'no-error'}</Text>
            <TouchableOpacity
              testID="login-button"
              onPress={async () => {
                try {
                  await auth.login({ email: 'test@example.com', password: 'wrong' });
                } catch (error) {
                  // Error is expected to be thrown
                }
              }}
            >
              <Text>Login</Text>
            </TouchableOpacity>
          </View>
        );
      };

      const { getByTestId } = render(
        <AuthProvider>
          <TestLoginErrorComponent />
        </AuthProvider>
      );

      await act(async () => {
        getByTestId('login-button').props.onPress();
      });

      await waitFor(() => {
        expect(getByTestId('error').props.children).toBe(errorMessage);
      });
    });

    it('should handle signup errors', async () => {
      const errorMessage = 'Signup failed';
      mockedAuthService.signup.mockRejectedValue(new Error(errorMessage));

      const TestSignupErrorComponent: React.FC = () => {
        const auth = useAuth();
        return (
          <View>
            <Text testID="error">{auth.error || 'no-error'}</Text>
            <TouchableOpacity
              testID="signup-button"
              onPress={async () => {
                try {
                  await auth.signup({ name: 'Test', email: 'test@example.com', password: 'password123' });
                } catch (error) {
                  // Error is expected to be thrown
                }
              }}
            >
              <Text>Signup</Text>
            </TouchableOpacity>
          </View>
        );
      };

      const { getByTestId } = render(
        <AuthProvider>
          <TestSignupErrorComponent />
        </AuthProvider>
      );

      await act(async () => {
        getByTestId('signup-button').props.onPress();
      });

      await waitFor(() => {
        expect(getByTestId('error').props.children).toBe(errorMessage);
      });
    });
  });
}); 