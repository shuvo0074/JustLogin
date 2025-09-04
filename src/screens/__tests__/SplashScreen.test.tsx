import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SplashScreen from '../SplashScreen';
import authReducer from '../../store/slices/authSlice';

// Mock the useAuth hook
const mockCheckAuthStatus = jest.fn();
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    checkAuthStatus: mockCheckAuthStatus,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

// Mock navigation
const mockNavigation = {
  reset: jest.fn(),
  navigate: jest.fn(),
  goBack: jest.fn(),
  canGoBack: jest.fn(),
  isFocused: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        loginForm: { email: '', password: '' },
        signupForm: { name: '', email: '', password: '', confirmPassword: '' },
        passwordVisibility: {
          login: { password: false },
          signup: { password: false, confirmPassword: false },
        },
        ...initialState,
      },
    },
  });
};

const renderWithProvider = (store = createMockStore()) => {
  return render(
    <Provider store={store}>
      <SplashScreen />
    </Provider>
  );
};

describe('SplashScreen', () => {
  beforeEach(() => {
    mockCheckAuthStatus.mockClear();
    mockNavigation.reset.mockClear();
  });

  it('renders correctly', () => {
    const { getByText } = renderWithProvider();
    
    expect(getByText('NSF GYM')).toBeTruthy();
    expect(getByText('NEVER STOP FIGHTING')).toBeTruthy();
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('shows loading indicator', () => {
    const { getByTestId } = renderWithProvider();
    
    // ActivityIndicator should be present
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('calls checkAuthStatus on mount', async () => {
    renderWithProvider();
    
    await waitFor(() => {
      expect(mockCheckAuthStatus).toHaveBeenCalled();
    });
  });
});
