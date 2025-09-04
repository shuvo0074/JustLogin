import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children, style, testID }) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { style, testID }, children);
  },
  useSafeAreaInsets: () => ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }),
  useSafeAreaFrame: () => ({
    x: 0,
    y: 0,
    width: 375,
    height: 812,
  }),
}));

// Mock React Native components and modules
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Modal: ({ children, visible }) => (visible ? children : null),
  ActivityIndicator: 'ActivityIndicator',
  Text: 'Text',
  View: 'View',
  TouchableOpacity: 'TouchableOpacity',
  TextInput: 'TextInput',
  StyleSheet: {
    create: (styles) => styles,
    flatten: (style) => style,
    hairlineWidth: 1,
    absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  },
  StatusBar: 'StatusBar',
  useColorScheme: () => 'light',
  Platform: {
    OS: 'ios',
    select: jest.fn(),
  },
  KeyboardAvoidingView: 'KeyboardAvoidingView',
  ScrollView: 'ScrollView',
}));

// Global test utilities
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}; 