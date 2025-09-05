# React Native Authentication App

A React Native application implementing authentication with login, signup, and logout functionality using the MVVM pattern, React Context API, and reusable components.

## Features

- **Authentication Flow**: Login, signup, and logout functionality
- **MVVM Architecture**: Clean separation of concerns with Model, View, ViewModel pattern
- **React Context API**: Global state management for authentication
- **Reusable Components**: Modular UI components for consistent design
- **Form Validation**: Client-side validation for email, password, and required fields
- **Password Visibility Toggle**: Show/hide password functionality with monkey-themed icons
- **AsyncStorage Persistence**: User authentication state persists across app restarts
- **React Navigation**: Screen navigation between login, signup, and home screens
- **Loading States**: Button loading indicators during authentication operations
- **Error Handling**: Comprehensive error handling with centralized error display
- **Centralized Validation**: Validation logic centralized in ViewModel layer
- **TypeScript**: Full type safety throughout the application

## Development Tools

This project includes comprehensive development tools for efficient React Native development:

### Makefile Commands

Use the provided Makefile for common development tasks:

```bash
# Show all available commands
make help

# Quick development start
make dev          # Clean caches and run Android
make fresh        # Full reset and run Android

# Cache management
make clean        # Clean common caches
make clean-all    # Clean all caches
make storage-info # Show storage usage

# Development workflow
make start        # Start Metro server
make run-android  # Run on Android
make run-ios      # Run on iOS

# Code quality
make lint         # Run ESLint
make format       # Format with Prettier
make test         # Run tests

# Network & Backend Configuration
make detect-ip           # Detect laptop's IP
make auto-set-ip         # Auto-set IP for phone connectivity
make set-backend-ip IP=192.168.1.100  # Manually set IP
make show-backend-config # Show current backend config
```

### Development Helper Script

For even quicker access to common commands:

```bash
# Quick commands
./dev.sh dev      # Start development
./dev.sh fresh    # Fresh project start
./dev.sh clean    # Clean caches
./dev.sh build    # Build APK
./dev.sh storage  # Show storage info

# Network configuration
./dev.sh ip       # Detect IP
./dev.sh auto-ip  # Auto-set IP for phone
./dev.sh config   # Show backend config

# Show all options
./dev.sh help
```

### Phone Connectivity Setup

To connect your phone to the backend running on your laptop:

```bash
# Auto-detect and set your laptop's IP
make auto-set-ip
# or
./dev.sh auto-ip

# Verify the configuration
make show-backend-config
# or
./dev.sh config
```

This will create a `.env.local` file with your laptop's IP address, allowing your phone to connect to the backend at `http://[YOUR_IP]:8080`.

See [MAKEFILE_README.md](MAKEFILE_README.md) for detailed documentation of all available commands.

## Usage

![signup gif](https://github.com/user-attachments/assets/1b9a9a82-34b9-434e-9aca-e02b99705a39)
![login gif](https://github.com/user-attachments/assets/a6018354-4ddb-4002-b81d-fe956691cb6e)

## Architecture

### MVVM Pattern Implementation

- **Model**: `AuthService` - Handles API calls and data persistence
- **View**: React components (`LoginScreen`, `SignupScreen`, `HomeScreen`) - UI layer
- **ViewModel**: `useAuthViewModel` - Business logic, state management, and validation
- **Context**: `AuthContext` - Global state provider

### Reusable Components

The application uses a modular component architecture with reusable UI components:

#### Core Components
- **`InputField`**: Extensible text input with labels, error states, and custom styling
- **`PasswordInput`**: Password input with visibility toggle functionality
- **`Button`**: Multi-variant button component (primary, secondary, danger) with loading states
- **`LoadingSpinner`**: Loading indicator with customizable message and styling
- **`UserInfoCard`**: User information display card with configurable fields
- **`PageTitle`**: Reusable page title component with size variants

#### Component Features
- **TypeScript Support**: Full type safety with proper interfaces
- **Customizable Styling**: Style props for container, text, and component-specific styling
- **Accessibility**: Built-in accessibility features
- **Performance Optimized**: Uses `useCallback` for memoization where appropriate
- **Test Coverage**: Comprehensive unit tests for all components

### File Structure

```
src/
├── components/          # Reusable UI Components
│   ├── __tests__/
│   │   ├── LoadingSpinner.test.tsx
│   │   ├── UserInfoCard.test.tsx
│   │   ├── PageTitle.test.tsx
│   │   └── PasswordInput.test.tsx
│   ├── InputField.tsx
│   ├── PasswordInput.tsx
│   ├── Button.tsx
│   ├── LoadingSpinner.tsx
│   ├── UserInfoCard.tsx
│   └── PageTitle.tsx
├── screens/            # Screen Components
│   ├── __tests__/
│   │   ├── HomeScreen.test.tsx
│   │   ├── LoginScreen.test.tsx
│   │   └── SignupScreen.test.tsx
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   └── SignupScreen.tsx
├── contexts/           # React Context
│   ├── __tests__/
│   │   └── AuthContext.test.tsx
│   └── AuthContext.tsx
├── navigation/         # Navigation setup
│   ├── __tests__/
│   │   └── AuthNavigator.test.tsx
│   └── AuthNavigator.tsx
├── services/          # API and data layer
│   ├── __tests__/
│   │   └── authService.test.ts
│   └── authService.ts
├── types/             # TypeScript definitions
│   ├── auth.ts
│   └── navigation.ts
├── viewmodels/        # Business logic layer
│   ├── __tests__/
│   │   └── authViewModel.test.ts
│   └── authViewModel.ts
└── index.ts           # Main exports
```

## Getting Started

### Prerequisites

- Node.js (>= 18)
- React Native CLI
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS (requires macOS):
   ```bash
   cd ios && pod install && cd ..
   ```

4. Start the Metro bundler:
   ```bash
   npm start
   ```

5. Run the app:
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## Testing

The project includes comprehensive unit tests using Jest and React Testing Library.

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test files
npm test -- --testPathPattern="authService"

# Run tests in watch mode
npm test -- --watch

# Run component tests only
npm test -- --testPathPattern="components"

# Run screen tests only
npm test -- --testPathPattern="screens"
```

### Test Coverage

The test suite covers:

- **Reusable Components**: All component variants, props, and edge cases
- **AuthService**: API methods, storage operations, validation
- **AuthViewModel**: State management, form handling, authentication logic, centralized validation
- **AuthContext**: Context provider, hook functionality, error handling
- **UI Components**: Form interactions, validation, navigation, error display
- **Navigation**: Screen routing, authentication state handling
- **App Component**: Main app rendering and navigation setup

### Test Structure

```
src/
├── components/__tests__/
│   ├── LoadingSpinner.test.tsx
│   ├── UserInfoCard.test.tsx
│   ├── PageTitle.test.tsx
│   └── PasswordInput.test.tsx
├── screens/__tests__/
│   ├── LoginScreen.test.tsx
│   ├── SignupScreen.test.tsx
│   └── HomeScreen.test.tsx
├── services/__tests__/
│   └── authService.test.ts
├── viewmodels/__tests__/
│   └── authViewModel.test.ts
├── contexts/__tests__/
│   └── AuthContext.test.tsx
└── navigation/__tests__/
    └── AuthNavigator.test.tsx

__tests__/
└── App.test.tsx
```

### Test Configuration

- **Jest Configuration**: `jest.config.js` - Test environment setup
- **Jest Setup**: `jest.setup.js` - Mock configurations and global setup
- **Coverage Threshold**: 80% for branches, functions, lines, and statements

## Key Features

### Authentication Flow

1. **App Startup**: Checks for existing authentication state
2. **Login/Signup**: Validates credentials and stores user data
3. **Persistence**: Uses AsyncStorage to maintain login state
4. **Navigation**: Automatically routes to appropriate screen based on auth state using `navigate`
5. **Success Handling**: Login/signup success is handled by the ViewModel, which manages the authentication state

### Reusable Components

#### InputField Component
```typescript
<InputField
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  label="Email Address"
/>
```

#### PasswordInput Component
```typescript
<PasswordInput
  placeholder="Password"
  value={password}
  onChangeText={setPassword}
  showToggle={true}
/>
```

#### Button Component
```typescript
<Button
  title="Login"
  variant="primary"
  size="medium"
  loading={isLoading}
  onPress={handleLogin}
/>
```

#### LoadingSpinner Component
```typescript
<LoadingSpinner
  message="Logging out..."
  size="large"
  color="#007AFF"
/>
```

#### UserInfoCard Component
```typescript
<UserInfoCard
  user={user}
  showId={true}
  showTimestamps={false}
/>
```

#### PageTitle Component
```typescript
<PageTitle
  title="Welcome!"
  variant="large"
/>
```

### Form Validation

- **Centralized Validation**: All validation logic is handled in the ViewModel layer
- **Email Validation**: Ensures valid email format
- **Password Requirements**: Minimum 6 characters
- **Required Fields**: All fields must be filled
- **Password Matching**: Confirm password must match (signup only)
- **Error Display**: Validation errors are displayed in a centralized error container at the top of forms
- **Real-time Feedback**: Visual indicators for validation errors through input styling

### Security Features

- **Password Visibility Toggle**: Users can show/hide passwords
- **Secure Storage**: Authentication tokens stored securely
- **Session Management**: Automatic logout on app restart (configurable)

## Dependencies

### Core Dependencies

- `react-native`: 0.80.2
- `react`: 19.1.0
- `@react-navigation/native`: ^7.1.16
- `@react-navigation/stack`: ^7.4.4
- `@react-native-async-storage/async-storage`: ^2.2.0

### Development Dependencies

- `jest`: ^29.6.3
- `@testing-library/react-native`: ^12.0.0
- `@testing-library/react-hooks`: ^8.0.1
- `typescript`: 5.0.4

## Recent Updates

### Component Refactoring
- **Reusable Components**: Created modular UI components for better code organization
- **TypeScript Support**: Enhanced type safety across all components
- **Performance Optimization**: Implemented `useCallback` for memoization
- **Test Coverage**: Added comprehensive tests for all new components

### Screen Updates
- **HomeScreen**: Refactored to use reusable components (LoadingSpinner, UserInfoCard, PageTitle)
- **LoginScreen**: Updated to use InputField, PasswordInput, and Button components
- **SignupScreen**: Updated to use InputField, PasswordInput, and Button components

### Testing Improvements
- **Component Tests**: Added 19 new tests for reusable components
- **Test Coverage**: Maintained 100% test coverage for all functionality
- **Test Organization**: Improved test structure and organization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
