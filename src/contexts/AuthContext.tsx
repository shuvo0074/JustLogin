import React, { createContext, useContext, useEffect, ReactNode, useRef } from 'react';
import { useAuthViewModel } from '../viewmodels/authViewModel';
import { LoginCredentials, SignupCredentials, User } from '../types/auth';

interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Form State
  loginForm: { email: string; password: string };
  signupForm: { name: string; email: string; password: string; confirmPassword: string };
  touchedFields: {
    login: { email: boolean; password: boolean };
    signup: { name: boolean; email: boolean; password: boolean; confirmPassword: boolean };
  };
  passwordVisibility: {
    login: { password: boolean };
    signup: { password: boolean; confirmPassword: boolean };
  };

  // Validation functions
  isValidEmail: (email: string) => boolean;
  isValidPassword: (password: string) => boolean;
  validateLoginForm: (email: string, password: string) => string | null;
  validateSignupForm: (name: string, email: string, password: string, confirmPassword: string) => string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<any>;
  signup: (credentials: SignupCredentials) => Promise<any>;
  logout: () => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
  updateLoginForm: (field: 'email' | 'password', value: string) => void;
  updateSignupForm: (field: 'name' | 'email' | 'password' | 'confirmPassword', value: string) => void;
  clearLoginForm: () => void;
  clearSignupForm: () => void;
  setFieldTouched: (formType: 'login' | 'signup', field: string, touched?: boolean) => void;
  clearTouchedFields: (formType: 'login' | 'signup') => void;
  toggleLoginPasswordVisibility: () => void;
  toggleSignupPasswordVisibility: (field: 'password' | 'confirmPassword') => void;
  handleLogin: () => Promise<any>;
  handleSignup: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authViewModel = useAuthViewModel();
  const hasCheckedAuth = useRef(false);

  // Check authentication status on app start - run only once
  useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      authViewModel.checkAuthStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once on mount

  const contextValue: AuthContextType = {
    // State
    user: authViewModel.user,
    isLoading: authViewModel.isLoading,
    error: authViewModel.error,
    isAuthenticated: authViewModel.isAuthenticated,

    // Form State
    loginForm: authViewModel.loginForm,
    signupForm: authViewModel.signupForm,
    touchedFields: authViewModel.touchedFields,
    passwordVisibility: authViewModel.passwordVisibility,

    // Validation functions
    isValidEmail: authViewModel.isValidEmail,
    isValidPassword: authViewModel.isValidPassword,
    validateLoginForm: authViewModel.validateLoginForm,
    validateSignupForm: authViewModel.validateSignupForm,

    // Actions
    login: authViewModel.login,
    signup: authViewModel.signup,
    logout: authViewModel.logout,
    clearError: authViewModel.clearError,
    setError: authViewModel.setError,
    updateLoginForm: authViewModel.updateLoginForm,
    updateSignupForm: authViewModel.updateSignupForm,
    clearLoginForm: authViewModel.clearLoginForm,
    clearSignupForm: authViewModel.clearSignupForm,
    setFieldTouched: authViewModel.setFieldTouched,
    clearTouchedFields: authViewModel.clearTouchedFields,
    toggleLoginPasswordVisibility: authViewModel.toggleLoginPasswordVisibility,
    toggleSignupPasswordVisibility: authViewModel.toggleSignupPasswordVisibility,
    handleLogin: authViewModel.handleLogin,
    handleSignup: authViewModel.handleSignup,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 