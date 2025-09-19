import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import { LoginCredentials, SignupCredentials, User, AuthResponse } from '../../types/auth';
import { fetchBusinesses, clearBusinesses } from './businessesSlice';

// Initial state (keeping exact same structure)
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  loginForm: { email: string; password: string };
  signupForm: { name: string; email: string; password: string; confirmPassword: string; role: string };
  passwordVisibility: {
    login: { password: boolean };
    signup: { password: boolean; confirmPassword: boolean };
  };
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  loginForm: {
    email: '',
    password: '',
  },
  signupForm: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member',
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
};

// Validation functions (keeping exact same logic)
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
  if (!isValidEmail(email)) {
    return 'Please enter a valid email address';
  }
  if (!password.trim()) {
    return 'Password is required';
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

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { dispatch }): Promise<AuthResponse> => {
    const response = await authService.login(credentials);
    
    // Fetch businesses after successful login (with delay to ensure token is set)
    setTimeout(() => {
      dispatch(fetchBusinesses({ page: 1, limit: 20 }));
    }, 1000);
    
    return response;
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (credentials: SignupCredentials, { dispatch }): Promise<AuthResponse> => {
    const response = await authService.signup(credentials);
    
    // Fetch businesses after successful signup (with delay to ensure token is set)
    setTimeout(() => {
      dispatch(fetchBusinesses({ page: 1, limit: 20 }));
    }, 1000);
    
    return response;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }): Promise<void> => {
    await authService.logout();
    
    // Clear businesses data on logout
    dispatch(clearBusinesses());
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { dispatch }): Promise<User | null> => {
    try {
      const user = await authService.getCurrentUser();
      
      // If user is already logged in, fetch businesses
      if (user) {
        setTimeout(() => {
          dispatch(fetchBusinesses({ page: 1, limit: 20 }));
        }, 1000);
      }
      
      return user;
    } catch (error) {
      // If UNAUTHORIZED error, dispatch logout to clear state
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        console.log('User unauthorized, logging out');
        dispatch(logout());
        return null;
      }
      throw error;
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateLoginForm: (state, action: PayloadAction<{ field: 'email' | 'password'; value: string }>) => {
      const { field, value } = action.payload;
      state.loginForm[field] = value;
    },
    updateSignupForm: (state, action: PayloadAction<{ field: 'name' | 'email' | 'password' | 'confirmPassword'; value: string }>) => {
      const { field, value } = action.payload;
      state.signupForm[field] = value;
    },
    clearLoginForm: (state) => {
      state.loginForm = {
        email: '',
        password: '',
      };
      state.passwordVisibility.login.password = false;
    },
    clearSignupForm: (state) => {
      state.signupForm = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'member',
      };
      state.passwordVisibility.signup.password = false;
      state.passwordVisibility.signup.confirmPassword = false;
    },
    toggleLoginPasswordVisibility: (state) => {
      state.passwordVisibility.login.password = !state.passwordVisibility.login.password;
    },
    toggleSignupPasswordVisibility: (state, action: PayloadAction<'password' | 'confirmPassword'>) => {
      const field = action.payload;
      state.passwordVisibility.signup[field] = !state.passwordVisibility.signup[field];
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      });

    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Signup failed';
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Logout failed';
      });

    // Check auth status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const {
  clearError,
  setError,
  updateLoginForm,
  updateSignupForm,
  clearLoginForm,
  clearSignupForm,
  toggleLoginPasswordVisibility,
  toggleSignupPasswordVisibility,
} = authSlice.actions;

// Export selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectLoginForm = (state: { auth: AuthState }) => state.auth.loginForm;
export const selectSignupForm = (state: { auth: AuthState }) => state.auth.signupForm;
export const selectPasswordVisibility = (state: { auth: AuthState }) => state.auth.passwordVisibility;

// Export validation functions
export { isValidEmail, isValidPassword, validateLoginForm, validateSignupForm };

export default authSlice.reducer;
