import { useState, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';
import { AuthState, LoginCredentials, SignupCredentials, User } from '../types/auth';

interface FormState {
  login: {
    email: string;
    password: string;
  };
  signup: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

export const useAuthViewModel = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  });

  const [formState, setFormState] = useState<FormState>({
    login: {
      email: '',
      password: '',
    },
    signup: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setUser = useCallback((user: User | null) => {
    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: !!user,
      isLoading: false,
      error: null,
    }));
  }, []);

  // Form update methods
  const updateLoginForm = useCallback((field: keyof FormState['login'], value: string) => {
    setFormState(prev => ({
      ...prev,
      login: {
        ...prev.login,
        [field]: value,
      },
    }));
  }, []);

  const updateSignupForm = useCallback((field: keyof FormState['signup'], value: string) => {
    setFormState(prev => ({
      ...prev,
      signup: {
        ...prev.signup,
        [field]: value,
      },
    }));
  }, []);

  const clearLoginForm = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      login: {
        email: '',
        password: '',
      },
    }));
  }, []);

  const clearSignupForm = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      signup: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
    }));
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      clearLoginForm(); // Clear form after successful login
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw error;
    }
  }, [setLoading, setUser, setError, clearLoginForm]);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      setLoading(true);
      const response = await authService.signup(credentials);
      setUser(response.user);
      clearSignupForm(); // Clear form after successful signup
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setError(errorMessage);
      throw error;
    }
  }, [setLoading, setUser, setError, clearSignupForm]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Form handlers with validation
  const handleLogin = useCallback(async () => {
    if (!formState.login.email || !formState.login.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      clearError();
      const response = await login({ 
        email: formState.login.email, 
        password: formState.login.password 
      });
      return response;
    } catch (error) {
      // Error is already handled by the login method
      console.error('Login error:', error);
    }
  }, [formState.login.email, formState.login.password, login, clearError, setError]);

  const handleSignup = useCallback(async () => {
    if (!formState.signup.name || !formState.signup.email || !formState.signup.password || !formState.signup.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formState.signup.password !== formState.signup.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formState.signup.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      clearError();
      const response = await signup({ 
        name: formState.signup.name, 
        email: formState.signup.email, 
        password: formState.signup.password 
      });
      return response;
    } catch (error) {
      // Error is already handled by the signup method
      console.error('Signup error:', error);
    }
  }, [formState.signup, signup, clearError, setError]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
      throw error;
    }
  }, [setLoading, setUser, setError]);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Check auth status error:', error);
      setUser(null);
    }
  }, [setLoading, setUser]);

  // Memoize the return object to prevent unnecessary re-renders
  const viewModel = useMemo(() => ({
    // State
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,

    // Form State
    loginForm: formState.login,
    signupForm: formState.signup,

    // Actions
    login,
    signup,
    logout,
    checkAuthStatus,
    clearError,
    updateLoginForm,
    updateSignupForm,
    clearLoginForm,
    clearSignupForm,
    handleLogin,
    handleSignup,
  }), [
    state.user, 
    state.isLoading, 
    state.error, 
    state.isAuthenticated,
    formState.login,
    formState.signup,
    login, 
    signup, 
    logout, 
    checkAuthStatus, 
    clearError,
    updateLoginForm,
    updateSignupForm,
    clearLoginForm,
    clearSignupForm,
    handleLogin,
    handleSignup,
  ]);

  return viewModel;
}; 