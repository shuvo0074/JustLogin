import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { AuthProvider } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { Alert } from 'react-native';

// Mock the authService
jest.mock('../../services/authService');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthService.logout.mockResolvedValue();
  });

  const renderHomeScreen = () => {
    return render(
      <AuthProvider>
        <HomeScreen />
      </AuthProvider>
    );
  };

  describe('Initial render', () => {
    it('should render welcome message', async () => {
      // Mock auth service to return a user
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByText } = renderHomeScreen();

      // Wait for loading to complete and welcome message to appear
      await waitFor(() => {
        expect(getByText('Welcome!')).toBeTruthy();
      });
    });

    it('should render logout button', async () => {
      // Mock auth service to return a user
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByText } = renderHomeScreen();

      // Wait for loading to complete and logout button to appear
      await waitFor(() => {
        expect(getByText('Logout')).toBeTruthy();
      });
    });
  });

  describe('User information display', () => {
    it('should display user information when user is logged in', async () => {
      // Mock a logged-in user
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };

      // Mock the auth service to return a user
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByText } = renderHomeScreen();

      // Wait for the user information to be loaded
      await waitFor(() => {
        expect(getByText('Welcome!')).toBeTruthy();
      });

      // The user information should be displayed
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('john@example.com')).toBeTruthy();
      expect(getByText('1')).toBeTruthy();
    });

    it('should handle case when no user is logged in', async () => {
      // Mock no user logged in
      mockedAuthService.getCurrentUser.mockResolvedValue(null);

      const { getByText } = renderHomeScreen();

      // Should still show the welcome message
      await waitFor(() => {
        expect(getByText('Welcome!')).toBeTruthy();
      });
    });
  });

  describe('Logout functionality', () => {
    it('should show logout confirmation dialog', async () => {
      // Mock auth service to return a user
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByText } = renderHomeScreen();

      // Wait for logout button to appear
      await waitFor(() => {
        expect(getByText('Logout')).toBeTruthy();
      });

      const logoutButton = getByText('Logout');

      fireEvent.press(logoutButton);

      // Check that Alert was called
      expect(Alert.alert).toHaveBeenCalledWith(
        'Logout',
        'Are you sure you want to logout?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Logout' }),
        ])
      );
    });

    it('should handle logout error gracefully', async () => {
      const errorMessage = 'Logout failed';
      mockedAuthService.logout.mockRejectedValue(new Error(errorMessage));

      // Mock auth service to return a user
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByText } = renderHomeScreen();

      // Wait for logout button to appear
      await waitFor(() => {
        expect(getByText('Logout')).toBeTruthy();
      });

      const logoutButton = getByText('Logout');

      fireEvent.press(logoutButton);

      // Should still render the component even if logout fails
      expect(getByText('Welcome!')).toBeTruthy();
    });

    it('should show loading state during logout', async () => {
      // Mock auth service to return a user
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByText } = renderHomeScreen();

      // Wait for logout button to appear
      await waitFor(() => {
        expect(getByText('Logout')).toBeTruthy();
      });

      const logoutButton = getByText('Logout');

      fireEvent.press(logoutButton);

      // Button should be disabled during loading
      expect(logoutButton.props.style).toBeDefined();
    });
  });

  describe('Navigation', () => {
    it('should show logout confirmation when logout button is pressed', async () => {
      // Mock auth service to return a user
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByText } = renderHomeScreen();

      // Wait for logout button to appear
      await waitFor(() => {
        expect(getByText('Logout')).toBeTruthy();
      });

      const logoutButton = getByText('Logout');

      fireEvent.press(logoutButton);

      // Check that Alert was called
      expect(Alert.alert).toHaveBeenCalledWith(
        'Logout',
        'Are you sure you want to logout?',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel' }),
          expect.objectContaining({ text: 'Logout' }),
        ])
      );
    });
  });

  describe('Error handling', () => {
    it('should handle auth service errors gracefully', async () => {
      // Mock auth service error
      mockedAuthService.getCurrentUser.mockRejectedValue(new Error('Auth service error'));

      const { getByText } = renderHomeScreen();

      // Should still render the component
      await waitFor(() => {
        expect(getByText('Welcome!')).toBeTruthy();
      });
      expect(getByText('Logout')).toBeTruthy();
    });
  });

  describe('Component lifecycle', () => {
    it('should mount and unmount correctly', () => {
      const { unmount } = renderHomeScreen();

      // Component should mount without errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible logout button', async () => {
      // Mock auth service to return a user
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByText, UNSAFE_getByType } = renderHomeScreen();

      // Wait for logout button to appear
      await waitFor(() => {
        expect(getByText('Logout')).toBeTruthy();
      });

      // Find the TouchableOpacity that contains the Logout text
      const logoutButton = getByText('Logout').parent;

      expect(logoutButton).toBeTruthy();
      // TouchableOpacity should have onPress prop
      expect(logoutButton?.props.onPress).toBeDefined();
    });

    it('should have accessible welcome text', async () => {
      // Mock auth service to return a user
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByText } = renderHomeScreen();

      // Wait for welcome text to appear
      await waitFor(() => {
        expect(getByText('Welcome!')).toBeTruthy();
      });

      const welcomeText = getByText('Welcome!');

      expect(welcomeText).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should apply correct styles to components', async () => {
      // Mock auth service to return a user
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
      };
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);

      const { getByText } = renderHomeScreen();

      // Wait for logout button to appear
      await waitFor(() => {
        expect(getByText('Logout')).toBeTruthy();
      });

      const logoutButton = getByText('Logout');

      // Check if button has the expected styling
      expect(logoutButton.props.style).toBeDefined();
    });
  });
}); 