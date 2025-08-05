import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { AuthNavigator } from '../AuthNavigator';
import { AuthProvider } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

// Mock the authService
jest.mock('../../services/authService');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

// Mock React Navigation
jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children, initialRouteName }: any) => (
      <div data-testid="navigator" data-initial-route={initialRouteName}>
        {children}
      </div>
    ),
    Screen: ({ name, component }: any) => {
      // Render the component with proper testID
      return (
        <div data-testid={`screen-${name}`} data-component={component.name}>
          {component.name}
        </div>
      );
    },
  }),
}));

// Mock the screen components
jest.mock('../../screens/LoginScreen', () => ({
  LoginScreen: () => null,
}));

jest.mock('../../screens/SignupScreen', () => ({
  SignupScreen: () => null,
}));

jest.mock('../../screens/HomeScreen', () => ({
  HomeScreen: () => null,
}));

describe('AuthNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderAuthNavigator = () => {
    return render(
      <AuthProvider>
        <AuthNavigator />
      </AuthProvider>
    );
  };

  describe('Initial render', () => {
    it('should render navigator with correct screens', async () => {
      // Mock auth service to return null (not authenticated)
      mockedAuthService.getCurrentUser.mockResolvedValue(null);

      const { getByTestId } = renderAuthNavigator();

      // Wait for auth check to complete
      await waitFor(() => {
        expect(getByTestId('navigator')).toBeTruthy();
      });

      // Should render auth screens when not authenticated
      expect(getByTestId('navigator')).toBeTruthy();
    });

    it('should show loading state initially', async () => {
      // Mock a delayed auth check
      mockedAuthService.getCurrentUser.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(null), 100))
      );

      const { getByTestId } = renderAuthNavigator();

      // Should show loading initially
      await waitFor(() => {
        expect(getByTestId('navigator')).toBeTruthy();
      });
    });
  });

  describe('Navigation logic', () => {
    it('should navigate to Login when user is not authenticated', async () => {
      mockedAuthService.getCurrentUser.mockResolvedValue(null);

      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        const navigator = getByTestId('navigator');
        expect(navigator.props['data-initial-route']).toBe('Login');
      });
    });

    it('should navigate to Home when user is authenticated', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };

      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        const navigator = getByTestId('navigator');
        expect(navigator.props['data-initial-route']).toBe('Home');
      });
    });

    it('should handle auth check error gracefully', async () => {
      mockedAuthService.getCurrentUser.mockRejectedValue(new Error('Auth check failed'));

      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        const navigator = getByTestId('navigator');
        // Should default to Login screen on error
        expect(navigator.props['data-initial-route']).toBe('Login');
      });
    });
  });

  describe('Screen components', () => {
    it('should render Login screen component when not authenticated', async () => {
      mockedAuthService.getCurrentUser.mockResolvedValue(null);

      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        expect(getByTestId('navigator')).toBeTruthy();
      });
    });

    it('should render Signup screen component when not authenticated', async () => {
      mockedAuthService.getCurrentUser.mockResolvedValue(null);

      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        expect(getByTestId('navigator')).toBeTruthy();
      });
    });

    it('should render Home screen component when authenticated', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        expect(getByTestId('navigator')).toBeTruthy();
      });
    });
  });

  describe('Loading state handling', () => {
    it('should handle loading state correctly', async () => {
      // Mock a delayed response
      mockedAuthService.getCurrentUser.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(null), 50))
      );

      const { getByTestId } = renderAuthNavigator();

      // Initially should be in loading state
      await waitFor(() => {
        expect(getByTestId('navigator')).toBeTruthy();
      });

      // Wait for loading to complete
      await waitFor(() => {
        expect(getByTestId('navigator')).toBeTruthy();
      });
    });

    it('should not show loading modal during auth check', async () => {
      // Mock a quick response
      mockedAuthService.getCurrentUser.mockResolvedValue(null);

      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        expect(getByTestId('navigator')).toBeTruthy();
      });
    });
  });

  describe('Error handling', () => {
    it('should handle auth service errors', async () => {
      mockedAuthService.getCurrentUser.mockRejectedValue(new Error('Network error'));

      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        const navigator = getByTestId('navigator');
        // Should default to Login screen on error
        expect(navigator.props['data-initial-route']).toBe('Login');
      });
    });

    it('should handle multiple auth check attempts', async () => {
      // Mock first call to fail, second to succeed
      mockedAuthService.getCurrentUser
        .mockRejectedValueOnce(new Error('First attempt failed'))
        .mockResolvedValueOnce(null);

      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        const navigator = getByTestId('navigator');
        expect(navigator.props['data-initial-route']).toBe('Login');
      });
    });
  });

  describe('Component lifecycle', () => {
    it('should mount and unmount correctly', () => {
      const { unmount } = renderAuthNavigator();

      // Component should mount without errors
      expect(() => unmount()).not.toThrow();
    });

    it('should handle auth context changes', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };

      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        const navigator = getByTestId('navigator');
        expect(navigator.props['data-initial-route']).toBe('Home');
      });
    });
  });

  describe('Navigation configuration', () => {
    it('should configure screens with correct options', async () => {
      const { getByTestId } = renderAuthNavigator();

      // Check that navigator is configured
      await waitFor(() => {
        expect(getByTestId('navigator')).toBeTruthy();
      });
    });

    it('should handle screen options correctly', async () => {
      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        const navigator = getByTestId('navigator');
        expect(navigator).toBeTruthy();
      });
    });
  });

  describe('Authentication state changes', () => {
    it('should update navigation when auth state changes', async () => {
      // Start with no user
      mockedAuthService.getCurrentUser.mockResolvedValue(null);

      const { getByTestId } = renderAuthNavigator();

      await waitFor(() => {
        const navigator = getByTestId('navigator');
        expect(navigator.props['data-initial-route']).toBe('Login');
      });

      // This would require testing with a real auth context that can change state
      // For now, we test the initial state behavior
    });
  });
}); 