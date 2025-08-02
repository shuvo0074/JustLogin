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
  passwordVisibility: {
    login: {
      password: boolean;
    };
    signup: {
      password: boolean;
      confirmPassword: boolean;
    };
  };
  touchedFields: {
    login: {
      email: boolean;
      password: boolean;
    };
    signup: {
      name: boolean;
      email: boolean;
      password: boolean;
      confirmPassword: boolean;
    };
  };
}

// Validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

const validateLoginForm = (email: string, password: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  if (!password.trim()) {
    return 'Password is required';
  }
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  if (!isValidPassword(password)) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

const validateSignupForm = (name: string, email: string, password: string, confirmPassword: string): string | null => {
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
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  if (!isValidPassword(password)) {
    return 'Password must be at least 6 characters long';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

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
    passwordVisibility: {
      login: {
        password: false,
      },
      signup: {
        password: false,
        confirmPassword: false,
      },
    },
    touchedFields: {
      login: {
        email: false,
        password: false,
      },
      signup: {
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
      },
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
      touchedFields: {
        ...prev.touchedFields,
        login: {
          ...prev.touchedFields.login,
          [field]: true,
        },
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
      touchedFields: {
        ...prev.touchedFields,
        signup: {
          ...prev.touchedFields.signup,
          [field]: true,
        },
      },
    }));
  }, []);

  const setFieldTouched = useCallback((formType: 'login' | 'signup', field: string, touched: boolean = true) => {
    setFormState(prev => ({
      ...prev,
      touchedFields: {
        ...prev.touchedFields,
        [formType]: {
          ...prev.touchedFields[formType],
          [field]: touched,
        },
      },
    }));
  }, []);

  const clearTouchedFields = useCallback((formType: 'login' | 'signup') => {
    setFormState(prev => ({
      ...prev,
      touchedFields: {
        ...prev.touchedFields,
        [formType]: formType === 'login'
          ? { email: false, password: false }
          : { name: false, email: false, password: false, confirmPassword: false },
      },
    }));
  }, []);

  const toggleLoginPasswordVisibility = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      passwordVisibility: {
        ...prev.passwordVisibility,
        login: {
          password: !prev.passwordVisibility.login.password,
        },
      },
    }));
  }, []);

  const toggleSignupPasswordVisibility = useCallback((field: 'password' | 'confirmPassword') => {
    setFormState(prev => ({
      ...prev,
      passwordVisibility: {
        ...prev.passwordVisibility,
        signup: {
          ...prev.passwordVisibility.signup,
          [field]: !prev.passwordVisibility.signup[field],
        },
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
      passwordVisibility: {
        ...prev.passwordVisibility,
        login: {
          password: false,
        },
      },
      touchedFields: {
        ...prev.touchedFields,
        login: {
          email: false,
          password: false,
        },
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
      passwordVisibility: {
        ...prev.passwordVisibility,
        signup: {
          password: false,
          confirmPassword: false,
        },
      },
      touchedFields: {
        ...prev.touchedFields,
        signup: {
          name: false,
          email: false,
          password: false,
          confirmPassword: false,
        },
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

  // Form handlers with comprehensive validation
  const handleLogin = useCallback(async () => {
    const validationError = validateLoginForm(formState.login.email, formState.login.password);

    if (validationError) {
      setError(validationError);
      return null; // Return null to indicate validation failure
    }

    try {
      clearError();
      const response = await login({
        email: formState.login.email.trim(),
        password: formState.login.password
      });
      return response;
    } catch (error) {
      // Error is already handled by the login method
      console.error('Login error:', error);
      return null; // Return null to indicate failure
    }
  }, [formState.login.email, formState.login.password, login, clearError, setError]);

  const handleSignup = useCallback(async () => {
    const validationError = validateSignupForm(
      formState.signup.name,
      formState.signup.email,
      formState.signup.password,
      formState.signup.confirmPassword
    );

    if (validationError) {
      setError(validationError);
      return null; // Return null to indicate validation failure
    }

    try {
      clearError();
      const response = await signup({
        name: formState.signup.name.trim(),
        email: formState.signup.email.trim(),
        password: formState.signup.password
      });
      return response;
    } catch (error) {
      // Error is already handled by the signup method
      console.error('Signup error:', error);
      return null; // Return null to indicate failure
    }
  }, [formState.signup, signup, clearError, setError]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      // Reset touched fields after logout
      clearTouchedFields('login');
      clearTouchedFields('signup');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setError(errorMessage);
      throw error;
    }
  }, [setLoading, setUser, setError, clearTouchedFields]);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Check auth status error:', error);
      setUser(null);
    } finally {
      setLoading(false);
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
    touchedFields: formState.touchedFields,
    passwordVisibility: formState.passwordVisibility,

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
    setFieldTouched,
    clearTouchedFields,
    toggleLoginPasswordVisibility,
    toggleSignupPasswordVisibility,
    handleLogin,
    handleSignup,

  }), [
    state.user,
    state.isLoading,
    state.error,
    state.isAuthenticated,
    formState.login,
    formState.signup,
    formState.touchedFields,
    formState.passwordVisibility,
    login,
    signup,
    logout,
    checkAuthStatus,
    clearError,
    updateLoginForm,
    updateSignupForm,
    clearLoginForm,
    clearSignupForm,
    setFieldTouched,
    clearTouchedFields,
    toggleLoginPasswordVisibility,
    toggleSignupPasswordVisibility,
    handleLogin,
    handleSignup,
  ]);

  return viewModel;
}; 