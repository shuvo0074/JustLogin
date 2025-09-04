import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectUser,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
  selectLoginForm,
  selectSignupForm,
  selectPasswordVisibility,
  login,
  signup,
  logout,
  checkAuthStatus,
  clearError,
  setError,
  updateLoginForm,
  updateSignupForm,
  clearLoginForm,
  clearSignupForm,
  toggleLoginPasswordVisibility,
  toggleSignupPasswordVisibility,
} from '../store/slices/authSlice';
import { LoginCredentials, SignupCredentials } from '../types/auth';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  
  // State selectors
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loginForm = useAppSelector(selectLoginForm);
  const signupForm = useAppSelector(selectSignupForm);
  const passwordVisibility = useAppSelector(selectPasswordVisibility);

  // Actions
  const loginAction = useCallback(async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(login(credentials)).unwrap();
      dispatch(clearLoginForm());
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const signupAction = useCallback(async (credentials: SignupCredentials) => {
    try {
      const result = await dispatch(signup(credentials)).unwrap();
      dispatch(clearSignupForm());
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const logoutAction = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const checkAuthStatusAction = useCallback(async () => {
    try {
      await dispatch(checkAuthStatus()).unwrap();
    } catch (error) {
      console.error('Check auth status error:', error);
    }
  }, [dispatch]);

  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setErrorAction = useCallback((error: string) => {
    dispatch(setError(error));
  }, [dispatch]);

  const updateLoginFormAction = useCallback((field: 'email' | 'password', value: string) => {
    dispatch(updateLoginForm({ field, value }));
  }, [dispatch]);

  const updateSignupFormAction = useCallback((field: 'name' | 'email' | 'password' | 'confirmPassword', value: string) => {
    dispatch(updateSignupForm({ field, value }));
  }, [dispatch]);

  const clearLoginFormAction = useCallback(() => {
    dispatch(clearLoginForm());
  }, [dispatch]);

  const clearSignupFormAction = useCallback(() => {
    dispatch(clearSignupForm());
  }, [dispatch]);

  const toggleLoginPasswordVisibilityAction = useCallback(() => {
    dispatch(toggleLoginPasswordVisibility());
  }, [dispatch]);

  const toggleSignupPasswordVisibilityAction = useCallback((field: 'password' | 'confirmPassword') => {
    dispatch(toggleSignupPasswordVisibility(field));
  }, [dispatch]);

  // Form handlers with validation
  const handleLogin = useCallback(async () => {
    const validationError = (() => {
      if (!loginForm.email.trim()) {
        return 'Email is required';
      }
      if (!loginForm.password.trim()) {
        return 'Password is required';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email)) {
        return 'Please enter a valid email address';
      }
      if (loginForm.password.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      return null;
    })();

    if (validationError) {
      setErrorAction(validationError);
      return null;
    }

    try {
      clearErrorAction();
      const response = await loginAction({
        email: loginForm.email.trim(),
        password: loginForm.password
      });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }, [loginForm.email, loginForm.password, loginAction, clearErrorAction, setErrorAction]);

  const handleSignup = useCallback(async () => {
    const validationError = (() => {
      if (!signupForm.name.trim()) {
        return 'Full name is required';
      }
      if (!signupForm.email.trim()) {
        return 'Email is required';
      }
      if (!signupForm.password.trim()) {
        return 'Password is required';
      }
      if (!signupForm.confirmPassword.trim()) {
        return 'Confirm password is required';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email)) {
        return 'Please enter a valid email address';
      }
      if (signupForm.password.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      if (signupForm.password !== signupForm.confirmPassword) {
        return 'Passwords do not match';
      }
      return null;
    })();

    if (validationError) {
      setErrorAction(validationError);
      return null;
    }

    try {
      clearErrorAction();
      const response = await signupAction({
        name: signupForm.name.trim(),
        email: signupForm.email.trim(),
        password: signupForm.password
      });
      return response;
    } catch (error) {
      console.error('Signup error:', error);
      return null;
    }
  }, [signupForm, signupAction, clearErrorAction, setErrorAction]);

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,
    loginForm,
    signupForm,
    passwordVisibility,

    // Validation functions
    isValidEmail: (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    isValidPassword: (password: string) => {
      return password.length >= 6;
    },
    validateLoginForm: (email: string, password: string) => {
      if (!email.trim()) {
        return 'Email is required';
      }
      if (!password.trim()) {
        return 'Password is required';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Please enter a valid email address';
      }
      if (password.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      return null;
    },
    validateSignupForm: (name: string, email: string, password: string, confirmPassword: string) => {
      if (!name.trim()) {
        return 'Full name is required';
      }
      if (!email.trim()) {
        return 'Email is required';
      }
      if (!password.trim()) {
        return 'Password is required';
      }
      if (!confirmPassword.trim()) {
        return 'Confirm password is required';
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Please enter a valid email address';
      }
      if (password.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      if (password !== confirmPassword) {
        return 'Passwords do not match';
      }
      return null;
    },

    // Actions
    login: loginAction,
    signup: signupAction,
    logout: logoutAction,
    checkAuthStatus: checkAuthStatusAction,
    clearError: clearErrorAction,
    setError: setErrorAction,
    updateLoginForm: updateLoginFormAction,
    updateSignupForm: updateSignupFormAction,
    clearLoginForm: clearLoginFormAction,
    clearSignupForm: clearSignupFormAction,
    toggleLoginPasswordVisibility: toggleLoginPasswordVisibilityAction,
    toggleSignupPasswordVisibility: toggleSignupPasswordVisibilityAction,
    handleLogin,
    handleSignup,
  };
};
