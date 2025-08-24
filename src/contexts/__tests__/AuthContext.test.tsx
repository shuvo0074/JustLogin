/**
 * AuthContext.test.tsx - Authentication Context Test Suite
 * 
 * This test file validates the authentication context's state management,
 * authentication operations, and context provider functionality.
 * 
 * Test Coverage:
 * - Context provider initialization
 * - Authentication state management
 * - Login/logout functionality
 * - Form state management
 * - Password visibility toggling
 * - Error handling and recovery
 * - Context hook usage
 * 
 * Dependencies:
 * - React Testing Library for component testing
 * - Mocked auth service for testing different scenarios
 * - Test components for context access
 */

import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { authService } from '../../services/authService';
import { LoginCredentials, SignupCredentials, User } from '../../types/auth';

// Mock the authService to control authentication responses in tests
jest.mock('../../services/authService');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

/**
 * Test Component for Context Access
 * 
 * This component uses the useAuth hook to access authentication context
 * and displays the current state for testing purposes.
 */
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

/**
 * Test Suite: Authentication Context
 * 
 * Tests the authentication context that manages user authentication state,
 * login/logout operations, and form management across the application.
 */
describe('AuthContext', () => {
  // Clear all mocks before each test to ensure clean state
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test Group: AuthProvider Component
   * 
   * Tests the context provider component that wraps the application
   * and provides authentication state and methods.
   */
  describe('AuthProvider', () => {
    /**
     * Test: Initial State Provision
     * 
     * Validates that the AuthProvider provides correct initial state
     * when first mounted without any authentication.
     */
    it('should provide initial state correctly', async () => {
      // Mock auth service to return null immediately (not authenticated)
      mockedAuthService.getCurrentUser.mockResolvedValue(null);

      const { getByTestId } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for auth check to complete before assertions
      await waitFor(() => {
        expect(getByTestId('isLoading').props.children).toBe('false');
      });

      // Should provide correct initial state
      expect(getByTestId('user').props.children).toBe('no-user');
      expect(getByTestId('isAuthenticated').props.children).toBe('false');
      expect(getByTestId('error').props.children).toBe('no-error');
      expect(getByTestId('loginForm').props.children).toBe('{"email":"","password":""}');
      expect(getByTestId('signupForm').props.children).toBe('{"name":"","email":"","password":"","confirmPassword":""}');
    });

    /**
     * Test: Authentication Status Check on Mount
     * 
     * Validates that the AuthProvider checks authentication status
     * when first mounted and updates state accordingly.
     */
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

      // Initially should be loading while checking auth status
      expect(getByTestId('isLoading').props.children).toBe('true');

      // Wait for auth check to complete
      await waitFor(() => {
        expect(getByTestId('isLoading').props.children).toBe('false');
      });

      // Should update state with authenticated user
      expect(getByTestId('user').props.children).toBe('Test User');
      expect(getByTestId('isAuthenticated').props.children).toBe('true');
      expect(mockedAuthService.getCurrentUser).toHaveBeenCalled();
    });

    /**
     * Test: Authentication Check Error Handling
     * 
     * Validates that the AuthProvider gracefully handles errors
     * during authentication status checks.
     */
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

      // Should handle error gracefully and remain unauthenticated
      expect(getByTestId('user').props.children).toBe('no-user');
      expect(getByTestId('isAuthenticated').props.children).toBe('false');
    });
  });

  /**
   * Test Group: useAuth Hook
   * 
   * Tests the useAuth hook that provides access to authentication
   * state and methods within components.
   */
  describe('useAuth hook', () => {
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    };

    // Set up mock responses for authentication operations
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
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);
    });

    /**
     * Test: Login Functionality
     * 
     * Validates that the login method works correctly and updates
     * authentication state upon successful login.
     */
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

      // Initially should not have a user
      expect(getByTestId('user').props.children).toBe('no-user');

      // Trigger login
      await act(async () => {
        getByTestId('login-button').props.onPress();
      });

      // Wait for login to complete and verify state update
      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('Test User');
      });

      // Should call auth service with correct credentials
      expect(mockedAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    /**
     * Test: Signup Functionality
     * 
     * Validates that the signup method works correctly and updates
     * authentication state upon successful signup.
     */
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

      // Initially should not have a user
      expect(getByTestId('user').props.children).toBe('no-user');

      // Trigger signup
      await act(async () => {
        getByTestId('signup-button').props.onPress();
      });

      // Wait for signup to complete and verify state update
      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('Test User');
      });

      // Should call auth service with correct credentials
      expect(mockedAuthService.signup).toHaveBeenCalledWith({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      });
    });

    /**
     * Test: Logout Functionality
     * 
     * Validates that the logout method works correctly and clears
     * authentication state upon successful logout.
     */
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

      // Wait for initial auth check to complete
      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('Test User');
      });

      // Trigger logout
      await act(async () => {
        getByTestId('logout-button').props.onPress();
      });

      // Wait for logout to complete and verify state update
      await waitFor(() => {
        expect(getByTestId('user').props.children).toBe('no-user');
      });

      expect(mockedAuthService.logout).toHaveBeenCalled();
    });

    /**
     * Test: Form Update Functionality
     * 
     * Validates that form state can be updated correctly
     * through the updateLoginForm method.
     */
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

      // Initially should have empty form
      expect(getByTestId('loginForm').props.children).toBe('{"email":"","password":""}');

      // Update email field
      act(() => {
        getByTestId('update-email').props.onPress();
      });

      // Should update form state
      expect(getByTestId('loginForm').props.children).toBe('{"email":"test@example.com","password":""}');
    });

    /**
     * Test: Error Handling Functionality
     * 
     * Validates that error state can be set and cleared
     * through the setError and clearError methods.
     */
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

      // Initially should have no error
      expect(getByTestId('error').props.children).toBe('no-error');

      // Set error
      act(() => {
        getByTestId('set-error').props.onPress();
      });

      // Should display error message
      expect(getByTestId('error').props.children).toBe('Test error');

      // Clear error
      act(() => {
        getByTestId('clear-error').props.onPress();
      });

      // Should clear error message
      expect(getByTestId('error').props.children).toBe('no-error');
    });

    /**
     * Test: Password Visibility Toggle Functionality
     * 
     * Validates that password visibility can be toggled
     * for both login and signup forms.
     */
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

      // Initially all passwords should be hidden
      expect(getByTestId('passwordVisibility').props.children).toBe(
        '{"login":{"password":false},"signup":{"password":false,"confirmPassword":false}}'
      );

      // Toggle login password visibility
      act(() => {
        getByTestId('toggle-login').props.onPress();
      });

      // Login password should now be visible
      expect(getByTestId('passwordVisibility').props.children).toBe(
        '{"login":{"password":true},"signup":{"password":false,"confirmPassword":false}}'
      );

      // Toggle signup password visibility
      act(() => {
        getByTestId('toggle-signup-password').props.onPress();
      });

      // Signup password should now be visible
      expect(getByTestId('passwordVisibility').props.children).toBe(
        '{"login":{"password":true},"signup":{"password":true,"confirmPassword":false}}'
      );

      // Toggle signup confirm password visibility
      act(() => {
        getByTestId('toggle-signup-confirm').props.onPress();
      });

      // All passwords should now be visible
      expect(getByTestId('passwordVisibility').props.children).toBe(
        '{"login":{"password":true},"signup":{"password":true,"confirmPassword":true}}'
      );
    });
  });

  /**
   * Test Group: Error Handling
   * 
   * Tests how the context handles various error scenarios
   * during authentication operations.
   */
  describe('Error handling', () => {
    /**
     * Test: Login Error Handling
     * 
     * Validates that login errors are properly handled
     * and error state is updated accordingly.
     */
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

      // Trigger login with invalid credentials
      await act(async () => {
        getByTestId('login-button').props.onPress();
      });

      // Should display error message
      await waitFor(() => {
        expect(getByTestId('error').props.children).toBe(errorMessage);
      });
    });

    /**
     * Test: Signup Error Handling
     * 
     * Validates that signup errors are properly handled
     * and error state is updated accordingly.
     */
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

      // Trigger signup with invalid credentials
      await act(async () => {
        getByTestId('signup-button').props.onPress();
      });

      // Should display error message
      await waitFor(() => {
        expect(getByTestId('error').props.children).toBe(errorMessage);
      });
    });
  });
}); 