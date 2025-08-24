# TypeScript Usage Guide - React Native Authentication App

This document provides a comprehensive overview of all TypeScript patterns and usage in this React Native authentication application. The app demonstrates modern TypeScript practices including interfaces, types, generics, union types, and advanced React patterns.

## Table of Contents

1. [Type Definitions](#type-definitions)
2. [Interface Patterns](#interface-patterns)
3. [React Component Types](#react-component-types)
4. [Context and Hooks](#context-and-hooks)
5. [Service Layer Types](#service-layer-types)
6. [Navigation Types](#navigation-types)
7. [Form Handling](#form-handling)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

## Type Definitions

### Core Authentication Types (`src/types/auth.ts`)

```typescript
// User entity interface
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Signup credentials interface (extends login with additional fields)
export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

// API response interface
export interface AuthResponse {
  user: User;
  token: string;
}

// Application state interface
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
```

**Key Concepts:**
- **Interface Composition**: `SignupCredentials` builds upon `LoginCredentials` pattern
- **Union Types**: `User | null` allows for authenticated/unauthenticated states
- **Primitive Types**: Using specific types like `string` instead of `any`

### Navigation Types (`src/types/navigation.ts`)

```typescript
import { StackNavigationProp } from '@react-navigation/stack';

// Route parameter definitions
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

// Navigation prop type for type-safe navigation
export type AuthStackNavigationProp = StackNavigationProp<RootStackParamList>;
```

**Key Concepts:**
- **Generic Types**: `StackNavigationProp<RootStackParamList>` provides type safety
- **Route Parameters**: `undefined` indicates no parameters for these routes
- **Type Exports**: Re-exporting React Navigation types for consistency

## Interface Patterns

### Component Props Interface (`src/components/Button.tsx`)

```typescript
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}
```

**Key Concepts:**
- **Interface Extension**: Extends React Native's `TouchableOpacityProps`
- **Union Types**: `variant` and `size` use literal union types for strict values
- **Optional Properties**: `?` makes properties optional
- **Style Types**: Using React Native's built-in style types

### Form State Interface (`src/viewmodels/authViewModel.ts`)

```typescript
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
}
```

**Key Concepts:**
- **Nested Interfaces**: Complex form state with nested objects
- **Boolean Flags**: Using boolean for UI state management
- **Consistent Structure**: Similar patterns for login and signup forms

## React Component Types

### Functional Component with Props (`src/components/Button.tsx`)

```typescript
export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  containerStyle,
  textStyle,
  style,
  ...props
}) => {
  // Component implementation
};
```

**Key Concepts:**
- **React.FC**: TypeScript type for functional components
- **Generic Props**: `React.FC<ButtonProps>` ensures type safety
- **Default Values**: TypeScript infers types from default values
- **Rest Parameters**: `...props` spreads remaining TouchableOpacityProps

### Screen Component with Navigation (`src/screens/LoginScreen.tsx`)

```typescript
export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const {
    handleLogin,
    isLoading,
    error,
    loginForm,
    updateLoginForm,
    clearError,
  } = useAuth();

  // Component implementation
};
```

**Key Concepts:**
- **Hook Typing**: `useNavigation<AuthStackNavigationProp>()` provides type safety
- **Context Usage**: `useAuth()` hook returns typed context values
- **Destructuring**: TypeScript ensures all destructured values are properly typed

## Context and Hooks

### Context Interface (`src/contexts/AuthContext.tsx`)

```typescript
interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Form State
  loginForm: { email: string; password: string };
  signupForm: { name: string; email: string; password: string; confirmPassword: string };
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
  // ... more actions
}
```

**Key Concepts:**
- **Comprehensive Interface**: All context values and methods defined upfront
- **Function Types**: Methods with proper parameter and return types
- **Promise Types**: Async operations properly typed
- **Union Return Types**: `string | null` for validation results

### Context Provider (`src/contexts/AuthContext.tsx`)

```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authViewModel = useAuthViewModel();
  
  const contextValue: AuthContextType = {
    // All context values mapped from view model
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Key Concepts:**
- **Generic Context**: `createContext<AuthContextType | undefined>`
- **Provider Props**: Interface for provider component props
- **Type Assertion**: `contextValue: AuthContextType` ensures type safety

### Custom Hook (`src/contexts/AuthContext.tsx`)

```typescript
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

**Key Concepts:**
- **Return Type**: `(): AuthContextType` specifies return type
- **Runtime Check**: Throws error if context is undefined
- **Type Guard**: Ensures context is always defined when returned

## Service Layer Types

### Service Class (`src/services/authService.ts`)

```typescript
class AuthService {
  private baseUrl = 'https://api.example.com/auth';
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  // Private helper methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      await this.delay(1000);
      
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        const mockUser: User = {
          id: '1',
          email: credentials.email,
          name: 'Test User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const mockToken = 'mock_jwt_token_' + Date.now();
        const response: AuthResponse = { user: mockUser, token: mockToken };
        
        await this.storeToken(mockToken);
        await this.storeUser(mockUser);
        
        return response;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }
}
```

**Key Concepts:**
- **Class Methods**: Proper typing for async methods
- **Private Properties**: Using `private` keyword for encapsulation
- **Type Assertions**: `mockUser: User` ensures object matches interface
- **Error Handling**: Proper error typing and propagation

## Navigation Types

### Stack Navigator (`src/navigation/AuthNavigator.tsx`)

```typescript
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export const AuthNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Home' : 'Login'}
      screenOptions={{ headerShown: false }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
};
```

**Key Concepts:**
- **Generic Navigator**: `createStackNavigator<RootStackParamList>()`
- **Conditional Rendering**: Type-safe screen rendering based on auth state
- **Screen Components**: Properly typed screen components

## Form Handling

### Form Validation (`src/viewmodels/authViewModel.ts`)

```typescript
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

const validateSignupForm = (
  name: string, 
  email: string, 
  password: string, 
  confirmPassword: string
): string | null => {
  if (!name.trim()) {
    return 'Full name is required';
  }
  // ... more validation
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};
```

**Key Concepts:**
- **Return Types**: `string | null` for validation results
- **Early Returns**: Multiple validation checks with early returns
- **String Methods**: Using `trim()` for input sanitization
- **Comparison Logic**: Type-safe string comparisons

### Form State Management (`src/viewmodels/authViewModel.ts`)

```typescript
const updateLoginForm = useCallback((field: keyof FormState['login'], value: string) => {
  setFormState(prev => ({
    ...prev,
    login: {
      ...prev.login,
      [field]: value,
    },
  }));
}, []);

const updateSignupForm = useCallback((
  field: 'name' | 'email' | 'password' | 'confirmPassword', 
  value: string
) => {
  setFormState(prev => ({
    ...prev,
    signup: {
      ...prev.signup,
      [field]: value,
    },
  }));
}, []);
```

**Key Concepts:**
- **Keyof Operator**: `keyof FormState['login']` extracts keys from nested object
- **Literal Union Types**: `'name' | 'email' | 'password' | 'confirmPassword'`
- **useCallback**: Memoized functions for performance
- **Spread Operator**: Immutable state updates with proper typing

## Error Handling

### Error Types and Handling (`src/services/authService.ts`)

```typescript
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // ... login logic
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
}

async getCurrentUser(): Promise<User | null> {
  try {
    const token = await this.getStoredToken();
    const user = await this.getStoredUser();

    if (token && user) {
      return user;
    }
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
```

**Key Concepts:**
- **Error Instances**: `error instanceof Error` type guard
- **Null Returns**: `Promise<User | null>` for optional results
- **Error Logging**: Proper error logging with fallbacks
- **Graceful Degradation**: Returning null instead of throwing

### ViewModel Error Handling (`src/viewmodels/authViewModel.ts`)

```typescript
const login = useCallback(async (credentials: LoginCredentials) => {
  try {
    setLoading(true);
    const response = await authService.login(credentials);
    setUser(response.user);
    clearLoginForm();
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed';
    setError(errorMessage);
    throw error;
  }
}, [setLoading, setUser, setError, clearLoginForm]);
```

**Key Concepts:**
- **Error Propagation**: Re-throwing errors after handling
- **State Management**: Setting loading and error states
- **User Feedback**: Converting errors to user-friendly messages
- **Dependency Arrays**: Proper useCallback dependencies

## Best Practices

### 1. Type Safety
- **Always define interfaces** for component props and data structures
- **Use union types** for limited value sets (e.g., `'primary' | 'secondary'`)
- **Avoid `any` type** - use specific types or `unknown`

### 2. Component Architecture
- **Separate concerns** with contexts, view models, and services
- **Use React.FC** for functional components with proper prop typing
- **Implement proper error boundaries** and error handling

### 3. State Management
- **Use TypeScript interfaces** for all state shapes
- **Implement immutable updates** with spread operators
- **Memoize expensive operations** with useCallback and useMemo

### 4. Navigation
- **Define route parameter types** for type-safe navigation
- **Use generic navigation hooks** for proper typing
- **Implement conditional routing** based on app state

### 5. Form Handling
- **Validate inputs** with proper error messages
- **Use controlled components** with typed state
- **Implement proper form state management**

### 6. Error Handling
- **Use type guards** for error instances
- **Provide fallback values** for optional operations
- **Log errors appropriately** for debugging

### 7. Performance
- **Memoize callbacks** with useCallback
- **Memoize computed values** with useMemo
- **Avoid unnecessary re-renders** with proper dependency arrays

## Example Usage Patterns

### Creating a New Component

```typescript
interface MyComponentProps {
  title: string;
  onPress?: () => void;
  variant?: 'default' | 'custom';
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
  variant = 'default'
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Adding New Types

```typescript
// src/types/newFeature.ts
export interface NewFeature {
  id: string;
  name: string;
  isEnabled: boolean;
  metadata?: Record<string, unknown>;
}

export type FeatureStatus = 'active' | 'inactive' | 'pending';
```

### Extending Existing Interfaces

```typescript
interface ExtendedUser extends User {
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  lastLoginAt: string;
}
```

## Advanced TypeScript Patterns

### Generic Utility Types (`src/viewmodels/authViewModel.ts`)

```typescript
// Using keyof with nested objects
const updateLoginForm = useCallback((field: keyof FormState['login'], value: string) => {
  setFormState(prev => ({
    ...prev,
    login: {
      ...prev.login,
      [field]: value,
    },
  }));
}, []);

// Conditional types for password visibility
type PasswordField = 'password' | 'confirmPassword';
const toggleSignupPasswordVisibility = useCallback((field: PasswordField) => {
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
```

**Key Concepts:**
- **Keyof with Nested Objects**: `keyof FormState['login']` extracts keys from specific nested object
- **Conditional Types**: Using union types for field validation
- **Index Access Types**: `[field]: value` with proper typing

### Mapped Types and Record Types

```typescript
// Example of how you could implement dynamic form validation
type ValidationRules = {
  [K in keyof LoginCredentials]: (value: string) => string | null;
};

const loginValidationRules: ValidationRules = {
  email: (value: string) => {
    if (!value.trim()) return 'Email is required';
    if (!isValidEmail(value)) return 'Invalid email format';
    return null;
  },
  password: (value: string) => {
    if (!value.trim()) return 'Password is required';
    if (value.length < 6) return 'Password too short';
    return null;
  }
};

// Using Record type for dynamic object creation
type FormErrors = Record<keyof LoginCredentials, string | null>;
```

### Template Literal Types

```typescript
// Example of template literal types for dynamic keys
type ActionType = 'login' | 'signup' | 'logout';
type LoadingState = `loading_${ActionType}`;
type ErrorState = `error_${ActionType}`;

// This would allow for:
// loading_login, loading_signup, loading_logout
// error_login, error_signup, error_logout
```

## Testing with TypeScript

### Component Testing (`src/components/__tests__/Button.test.tsx`)

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders with correct title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('handles press events', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button title="Test Button" onPress={mockOnPress} />);
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    const { getByText } = render(
      <Button title="Danger Button" variant="danger" onPress={() => {}} />
    );
    
    const button = getByText('Danger Button').parent;
    expect(button).toHaveStyle({ backgroundColor: '#FF3B30' });
  });
});
```

### Context Testing (`src/contexts/__tests__/AuthContext.test.tsx`)

```typescript
import React from 'react';
import { render, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';

// Test component that uses the context
const TestComponent: React.FC = () => {
  const { user, isLoading, login } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not loading'}</div>
      <button onPress={() => login({ email: 'test@test.com', password: 'password' })}>
        Login
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  it('provides authentication state', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(getByTestId('user')).toHaveTextContent('No user');
    expect(getByTestId('loading')).toHaveTextContent('Not loading');
  });
});
```

### Service Testing (`src/services/__tests__/authService.test.ts`)

```typescript
import { authService } from '../authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  multiRemove: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully logs in with valid credentials', async () => {
    const credentials = { email: 'test@example.com', password: 'password' };
    
    const result = await authService.login(credentials);
    
    expect(result.user).toBeDefined();
    expect(result.token).toBeDefined();
    expect(result.user.email).toBe(credentials.email);
  });

  it('throws error with invalid credentials', async () => {
    const credentials = { email: 'invalid@test.com', password: 'wrong' };
    
    await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');
  });
});
```

## Performance Optimization with TypeScript

### Memoization Patterns (`src/viewmodels/authViewModel.ts`)

```typescript
// Memoized validation functions
const memoizedValidation = useMemo(() => ({
  isValidEmail,
  isValidPassword,
  validateLoginForm,
  validateSignupForm,
}), []);

// Memoized form handlers
const handleLogin = useCallback(async () => {
  const validationError = validateLoginForm(formState.login.email, formState.login.password);
  
  if (validationError) {
    setError(validationError);
    return null;
  }
  
  try {
    clearError();
    const response = await login({
      email: formState.login.email.trim(),
      password: formState.login.password
    });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}, [formState.login.email, formState.login.password, login, clearError, setError]);
```

### Type-Safe Event Handlers

```typescript
// Generic event handler type
type ChangeHandler<T> = (value: T) => void;

// Form field change handler
const handleFieldChange = useCallback<ChangeHandler<string>>((value: string) => {
  // Type-safe value handling
  updateLoginForm('email', value);
}, [updateLoginForm]);

// Button press handler
const handleButtonPress = useCallback<() => void>(() => {
  // Type-safe button handling
  onLoginPress();
}, [onLoginPress]);
```

## Error Boundaries and Type Safety

### Custom Error Types

```typescript
// Custom error classes for better error handling
export class AuthError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_CREDENTIALS' | 'NETWORK_ERROR' | 'VALIDATION_ERROR',
    public field?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Usage in service
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    // ... login logic
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError('Login failed', 'NETWORK_ERROR');
  }
}
```

### Type-Safe Error Handling

```typescript
// Error handling with type guards
const handleError = (error: unknown): string => {
  if (error instanceof AuthError) {
    switch (error.code) {
      case 'INVALID_CREDENTIALS':
        return 'Invalid email or password';
      case 'NETWORK_ERROR':
        return 'Network connection failed';
      case 'VALIDATION_ERROR':
        return `Validation error: ${error.message}`;
      default:
        return 'An unexpected error occurred';
    }
  }
  
  if (error instanceof ValidationError) {
    return `Field "${error.field}": ${error.message}`;
  }
  
  return 'An unknown error occurred';
};
```

## Advanced Component Patterns

### Higher-Order Components with TypeScript

```typescript
// HOC for authentication
interface WithAuthProps {
  isAuthenticated: boolean;
  user: User | null;
}

const withAuth = <P extends WithAuthProps>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, keyof WithAuthProps>> => {
  return (props) => {
    const { isAuthenticated, user } = useAuth();
    
    return (
      <Component
        {...(props as P)}
        isAuthenticated={isAuthenticated}
        user={user}
      />
    );
  };
};

// Usage
const AuthenticatedComponent = withAuth<{ title: string } & WithAuthProps>(
  ({ title, isAuthenticated, user }) => (
    <View>
      <Text>{title}</Text>
      {isAuthenticated && <Text>Welcome, {user?.name}</Text>}
    </View>
  )
);
```

### Render Props Pattern

```typescript
interface AuthRenderProps {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<any>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: (props: AuthRenderProps) => React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authViewModel = useAuthViewModel();
  
  const renderProps: AuthRenderProps = {
    isAuthenticated: authViewModel.isAuthenticated,
    user: authViewModel.user,
    login: authViewModel.login,
    logout: authViewModel.logout,
  };
  
  return <>{children(renderProps)}</>;
};

// Usage
<AuthProvider>
  {({ isAuthenticated, user, login, logout }) => (
    <View>
      {isAuthenticated ? (
        <Text>Welcome, {user?.name}</Text>
      ) : (
        <LoginForm onLogin={login} />
      )}
    </View>
  )}
</AuthProvider>
```

## Configuration and Environment Types

### Environment Configuration

```typescript
// Environment types
type Environment = 'development' | 'staging' | 'production';

interface Config {
  apiUrl: string;
  timeout: number;
  retryAttempts: number;
  enableLogging: boolean;
}

const configs: Record<Environment, Config> = {
  development: {
    apiUrl: 'http://localhost:3000',
    timeout: 5000,
    retryAttempts: 3,
    enableLogging: true,
  },
  staging: {
    apiUrl: 'https://staging-api.example.com',
    timeout: 10000,
    retryAttempts: 2,
    enableLogging: true,
  },
  production: {
    apiUrl: 'https://api.example.com',
    timeout: 15000,
    retryAttempts: 1,
    enableLogging: false,
  },
};

const getConfig = (): Config => {
  const env = (process.env.NODE_ENV as Environment) || 'development';
  return configs[env];
};
```

## Migration and Refactoring Tips

### Converting JavaScript to TypeScript

```typescript
// Before (JavaScript)
const validateForm = (data) => {
  if (!data.email) return 'Email required';
  if (!data.password) return 'Password required';
  return null;
};

// After (TypeScript)
interface FormData {
  email: string;
  password: string;
}

const validateForm = (data: FormData): string | null => {
  if (!data.email) return 'Email required';
  if (!data.password) return 'Password required';
  return null;
};
```

### Incremental TypeScript Adoption

```typescript
// Start with any, then gradually type
// Step 1: Add basic types
const user: any = { name: 'John', age: 30 };

// Step 2: Add interface
interface User {
  name: string;
  age: number;
}
const user: User = { name: 'John', age: 30 };

// Step 3: Add strict types
interface StrictUser {
  readonly id: string;
  name: string;
  age: number;
  email?: string;
}
const user: StrictUser = { id: '1', name: 'John', age: 30 };
```

## Common TypeScript Pitfalls and Solutions

### 1. Strict Null Checks

```typescript
// Problem: Potential null reference
const getUserName = (user: User | null): string => {
  return user.name; // Error: Object is possibly null
};

// Solution: Null checking
const getUserName = (user: User | null): string => {
  if (!user) return 'Unknown User';
  return user.name;
};

// Alternative: Optional chaining
const getUserName = (user: User | null): string => {
  return user?.name ?? 'Unknown User';
};
```

### 2. Array Type Safety

```typescript
// Problem: Loose array typing
const numbers: any[] = [1, 2, 3, 'four']; // Allows mixed types

// Solution: Strict array typing
const numbers: number[] = [1, 2, 3]; // Only numbers allowed
const mixed: (string | number)[] = [1, 'two', 3]; // Union types

// Generic array types
const createArray = <T>(length: number, value: T): T[] => {
  return Array(length).fill(value);
};

const stringArray = createArray(3, 'hello'); // string[]
const numberArray = createArray(3, 42); // number[]
```

### 3. Function Overloading

```typescript
// Function overloads for different parameter types
function processData(data: string): string;
function processData(data: number): number;
function processData(data: string | number): string | number {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  return data * 2;
}

// Usage
const result1 = processData('hello'); // string
const result2 = processData(5); // number
```

## Conclusion

This comprehensive TypeScript implementation demonstrates advanced patterns and best practices for building robust React Native applications. The key takeaways include:

1. **Type Safety**: Comprehensive interfaces and types prevent runtime errors
2. **Performance**: Proper use of memoization and optimization techniques
3. **Maintainability**: Clear separation of concerns and well-defined contracts
4. **Testing**: Type-safe testing with proper mocking and assertions
5. **Scalability**: Patterns that grow with your application needs

The codebase serves as an excellent reference for implementing TypeScript in React Native projects, showcasing both basic and advanced patterns that can be adapted for various use cases.

For further learning, consider exploring:
- TypeScript utility types (`Partial`, `Pick`, `Omit`, etc.)
- Advanced generic constraints
- Conditional types and mapped types
- TypeScript compiler options and strict mode
- Integration with other tools (ESLint, Prettier, etc.)
