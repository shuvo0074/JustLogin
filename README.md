# React Native Authentication App

A React Native application implementing authentication with login, signup, and logout functionality using the MVVM pattern and React Context API.

## Features

- **Authentication Flow**: Login, signup, and logout functionality
- **MVVM Architecture**: Clean separation of concerns with Model, View, ViewModel pattern
- **React Context API**: Global state management for authentication
- **Form Validation**: Client-side validation for email, password, and required fields
- **Password Visibility Toggle**: Show/hide password functionality with monkey-themed icons
- **AsyncStorage Persistence**: User authentication state persists across app restarts
- **React Navigation**: Screen navigation between login, signup, and home screens
- **Loading States**: Button loading indicators during authentication operations
- **Error Handling**: Comprehensive error handling with centralized error display
- **Centralized Validation**: Validation logic centralized in ViewModel layer

## Usage

![signup gif](https://github.com/user-attachments/assets/1b9a9a82-34b9-434e-9aca-e02b99705a39)
![login gif](https://github.com/user-attachments/assets/a6018354-4ddb-4002-b81d-fe956691cb6e)




## Architecture

### MVVM Pattern Implementation

- **Model**: `AuthService` - Handles API calls and data persistence
- **View**: React components (`LoginScreen`, `SignupScreen`, `HomeScreen`) - UI layer
- **ViewModel**: `useAuthViewModel` - Business logic, state management, and validation
- **Context**: `AuthContext` - Global state provider

### File Structure

```
src/
├── components/          # UI Components
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   └── HomeScreen.tsx
├── contexts/           # React Context
│   └── AuthContext.tsx
├── navigation/         # Navigation setup
│   └── AuthNavigator.tsx
├── services/          # API and data layer
│   └── authService.ts
├── types/             # TypeScript definitions
│   ├── auth.ts
│   └── navigation.ts
├── viewmodels/        # Business logic layer
│   └── authViewModel.ts
└── __tests__/         # Unit tests
    ├── components/
    ├── contexts/
    ├── navigation/
    ├── services/
    └── viewmodels/
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
```

### Test Coverage

The test suite covers:

- **AuthService**: API methods, storage operations, validation
- **AuthViewModel**: State management, form handling, authentication logic, centralized validation
- **AuthContext**: Context provider, hook functionality, error handling
- **UI Components**: Form interactions, validation, navigation, error display
- **Navigation**: Screen routing, authentication state handling
- **App Component**: Main app rendering and navigation setup

### Test Structure

```
src/__tests__/
├── services/
│   └── authService.test.ts      # API and storage tests
├── viewmodels/
│   └── authViewModel.test.ts    # Business logic tests
├── contexts/
│   └── AuthContext.test.tsx     # Context provider tests
├── components/
│   ├── LoginScreen.test.tsx     # Login form tests
│   ├── SignupScreen.test.tsx    # Signup form tests
│   └── HomeScreen.test.tsx      # Home screen tests
└── navigation/
    └── AuthNavigator.test.tsx   # Navigation tests

__tests__/
└── App.test.tsx                 # App component test
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
