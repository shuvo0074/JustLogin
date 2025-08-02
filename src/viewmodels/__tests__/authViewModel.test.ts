import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthViewModel } from '../authViewModel';
import { authService } from '../../services/authService';
import { LoginCredentials, SignupCredentials, User } from '../../types/auth';

// Mock the authService
jest.mock('../../services/authService');
const mockedAuthService = authService as jest.Mocked<typeof authService>;

describe('useAuthViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthViewModel());

      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.loginForm).toEqual({
        email: '',
        password: '',
      });
      expect(result.current.signupForm).toEqual({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      expect(result.current.touchedFields).toEqual({
        login: { email: false, password: false },
        signup: { name: false, email: false, password: false, confirmPassword: false },
      });
      expect(result.current.passwordVisibility).toEqual({
        login: { password: false },
        signup: { password: false, confirmPassword: false },
      });
    });
  });

  describe('form updates', () => {
    it('should update login form correctly', () => {
      const { result } = renderHook(() => useAuthViewModel());

      act(() => {
        result.current.updateLoginForm('email', 'test@example.com');
      });

      expect(result.current.loginForm.email).toBe('test@example.com');
      expect(result.current.touchedFields.login.email).toBe(true);
    });

    it('should update signup form correctly', () => {
      const { result } = renderHook(() => useAuthViewModel());

      act(() => {
        result.current.updateSignupForm('name', 'Test User');
      });

      expect(result.current.signupForm.name).toBe('Test User');
      expect(result.current.touchedFields.signup.name).toBe(true);
    });

    it('should clear login form correctly', () => {
      const { result } = renderHook(() => useAuthViewModel());

      // First update the form
      act(() => {
        result.current.updateLoginForm('email', 'test@example.com');
        result.current.updateLoginForm('password', 'password123');
      });

      // Then clear it
      act(() => {
        result.current.clearLoginForm();
      });

      expect(result.current.loginForm).toEqual({
        email: '',
        password: '',
      });
      expect(result.current.touchedFields.login).toEqual({
        email: false,
        password: false,
      });
      expect(result.current.passwordVisibility.login).toEqual({
        password: false,
      });
    });

    it('should clear signup form correctly', () => {
      const { result } = renderHook(() => useAuthViewModel());

      // First update the form
      act(() => {
        result.current.updateSignupForm('name', 'Test User');
        result.current.updateSignupForm('email', 'test@example.com');
      });

      // Then clear it
      act(() => {
        result.current.clearSignupForm();
      });

      expect(result.current.signupForm).toEqual({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      expect(result.current.touchedFields.signup).toEqual({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
      });
      expect(result.current.passwordVisibility.signup).toEqual({
        password: false,
        confirmPassword: false,
      });
    });
  });

  describe('password visibility', () => {
    it('should toggle login password visibility', () => {
      const { result } = renderHook(() => useAuthViewModel());

      expect(result.current.passwordVisibility.login.password).toBe(false);

      act(() => {
        result.current.toggleLoginPasswordVisibility();
      });

      expect(result.current.passwordVisibility.login.password).toBe(true);

      act(() => {
        result.current.toggleLoginPasswordVisibility();
      });

      expect(result.current.passwordVisibility.login.password).toBe(false);
    });

    it('should toggle signup password visibility', () => {
      const { result } = renderHook(() => useAuthViewModel());

      expect(result.current.passwordVisibility.signup.password).toBe(false);
      expect(result.current.passwordVisibility.signup.confirmPassword).toBe(false);

      act(() => {
        result.current.toggleSignupPasswordVisibility('password');
      });

      expect(result.current.passwordVisibility.signup.password).toBe(true);
      expect(result.current.passwordVisibility.signup.confirmPassword).toBe(false);

      act(() => {
        result.current.toggleSignupPasswordVisibility('confirmPassword');
      });

      expect(result.current.passwordVisibility.signup.password).toBe(true);
      expect(result.current.passwordVisibility.signup.confirmPassword).toBe(true);
    });
  });

  describe('touched fields', () => {
    it('should set field touched correctly', () => {
      const { result } = renderHook(() => useAuthViewModel());

      act(() => {
        result.current.setFieldTouched('login', 'email');
      });

      expect(result.current.touchedFields.login.email).toBe(true);
      expect(result.current.touchedFields.login.password).toBe(false);
    });

    it('should clear touched fields correctly', () => {
      const { result } = renderHook(() => useAuthViewModel());

      // First set some fields as touched
      act(() => {
        result.current.setFieldTouched('login', 'email');
        result.current.setFieldTouched('login', 'password');
      });

      // Then clear them
      act(() => {
        result.current.clearTouchedFields('login');
      });

      expect(result.current.touchedFields.login).toEqual({
        email: false,
        password: false,
      });
    });
  });

  describe('authentication operations', () => {
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const mockCredentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
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
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser);
    });

    describe('login', () => {
      it('should login successfully', async () => {
        const { result } = renderHook(() => useAuthViewModel());

        await act(async () => {
          await result.current.login(mockCredentials);
        });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(mockedAuthService.login).toHaveBeenCalledWith(mockCredentials);
      });

      it('should handle login error', async () => {
        const errorMessage = 'Login failed';
        mockedAuthService.login.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useAuthViewModel());

        await act(async () => {
          await expect(result.current.login(mockCredentials)).rejects.toThrow(errorMessage);
        });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.isLoading).toBe(false);
      });
    });

    describe('signup', () => {
      const mockSignupCredentials: SignupCredentials = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'newpassword123',
      };

      it('should signup successfully', async () => {
        const { result } = renderHook(() => useAuthViewModel());

        await act(async () => {
          await result.current.signup(mockSignupCredentials);
        });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(mockedAuthService.signup).toHaveBeenCalledWith(mockSignupCredentials);
      });

      it('should handle signup error', async () => {
        const errorMessage = 'Signup failed';
        mockedAuthService.signup.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useAuthViewModel());

        await act(async () => {
          await expect(result.current.signup(mockSignupCredentials)).rejects.toThrow(errorMessage);
        });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.isLoading).toBe(false);
      });
    });

    describe('logout', () => {
      it('should logout successfully', async () => {
        const { result } = renderHook(() => useAuthViewModel());

        // First login
        await act(async () => {
          await result.current.login(mockCredentials);
        });

        // Then logout
        await act(async () => {
          await result.current.logout();
        });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(mockedAuthService.logout).toHaveBeenCalled();
      });

      it('should handle logout error', async () => {
        const errorMessage = 'Logout failed';
        mockedAuthService.logout.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useAuthViewModel());

        await act(async () => {
          await expect(result.current.logout()).rejects.toThrow(errorMessage);
        });

        expect(result.current.error).toBe(errorMessage);
        expect(result.current.isLoading).toBe(false);
      });
    });

    describe('checkAuthStatus', () => {
      it('should check auth status successfully', async () => {
        const { result } = renderHook(() => useAuthViewModel());

        await act(async () => {
          await result.current.checkAuthStatus();
        });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(mockedAuthService.getCurrentUser).toHaveBeenCalled();
      });

      it('should handle check auth status error', async () => {
        mockedAuthService.getCurrentUser.mockRejectedValue(new Error('Auth check failed'));

        const { result } = renderHook(() => useAuthViewModel());

        await act(async () => {
          await result.current.checkAuthStatus();
        });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('form handlers', () => {
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    });

    describe('handleLogin', () => {
      it('should handle login successfully with valid form data', async () => {
        const { result } = renderHook(() => useAuthViewModel());

        // Set up form data
        act(() => {
          result.current.updateLoginForm('email', 'test@example.com');
          result.current.updateLoginForm('password', 'password123');
        });

        await act(async () => {
          const response = await result.current.handleLogin();
          expect(response).toBeDefined();
        });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.error).toBeNull();
      });

      it('should return null for invalid email', async () => {
        const { result } = renderHook(() => useAuthViewModel());

        // Set up invalid form data
        act(() => {
          result.current.updateLoginForm('email', 'invalid-email');
          result.current.updateLoginForm('password', 'password123');
        });

        await act(async () => {
          const response = await result.current.handleLogin();
          expect(response).toBeNull();
        });

        expect(result.current.error).toBe('Please enter a valid email address');
        expect(result.current.user).toBeNull();
      });

      it('should return null for short password', async () => {
        const { result } = renderHook(() => useAuthViewModel());

        // Set up invalid form data
        act(() => {
          result.current.updateLoginForm('email', 'test@example.com');
          result.current.updateLoginForm('password', '123');
        });

        await act(async () => {
          const response = await result.current.handleLogin();
          expect(response).toBeNull();
        });

        expect(result.current.error).toBe('Password must be at least 6 characters long');
        expect(result.current.user).toBeNull();
      });

      it('should return null for empty fields', async () => {
        const { result } = renderHook(() => useAuthViewModel());

        await act(async () => {
          const response = await result.current.handleLogin();
          expect(response).toBeNull();
        });

        expect(result.current.error).toBe('Email is required');
        expect(result.current.user).toBeNull();
      });
    });

    describe('handleSignup', () => {
      it('should handle signup successfully with valid form data', async () => {
        const { result } = renderHook(() => useAuthViewModel());

        // Set up form data
        act(() => {
          result.current.updateSignupForm('name', 'Test User');
          result.current.updateSignupForm('email', 'test@example.com');
          result.current.updateSignupForm('password', 'password123');
          result.current.updateSignupForm('confirmPassword', 'password123');
        });

        await act(async () => {
          const response = await result.current.handleSignup();
          expect(response).toBeDefined();
        });

        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.error).toBeNull();
      });

      it('should return null for password mismatch', async () => {
        const { result } = renderHook(() => useAuthViewModel());

        // Set up form data with mismatched passwords
        act(() => {
          result.current.updateSignupForm('name', 'Test User');
          result.current.updateSignupForm('email', 'test@example.com');
          result.current.updateSignupForm('password', 'password123');
          result.current.updateSignupForm('confirmPassword', 'differentpassword');
        });

        await act(async () => {
          const response = await result.current.handleSignup();
          expect(response).toBeNull();
        });

        expect(result.current.error).toBe('Passwords do not match');
        expect(result.current.user).toBeNull();
      });

      it('should return null for invalid email', async () => {
        const { result } = renderHook(() => useAuthViewModel());

        // Set up form data with invalid email
        act(() => {
          result.current.updateSignupForm('name', 'Test User');
          result.current.updateSignupForm('email', 'invalid-email');
          result.current.updateSignupForm('password', 'password123');
          result.current.updateSignupForm('confirmPassword', 'password123');
        });

        await act(async () => {
          const response = await result.current.handleSignup();
          expect(response).toBeNull();
        });

        expect(result.current.error).toBe('Please enter a valid email address');
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe('error handling', () => {
    it('should clear error correctly', () => {
      const { result } = renderHook(() => useAuthViewModel());

      // First set an error by triggering a login failure
      act(() => {
        result.current.updateLoginForm('email', 'invalid@example.com');
        result.current.updateLoginForm('password', 'wrongpassword');
      });

      // Then clear it
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
}); 