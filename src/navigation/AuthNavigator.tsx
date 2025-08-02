import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../components/LoginScreen';
import { SignupScreen } from '../components/SignupScreen';
import { HomeScreen } from '../components/HomeScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export const AuthNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <View style={{
      flex: 1,
    }} testID="navigator" data-initial-route={isAuthenticated ? 'Home' : 'Login'}>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? 'Home' : 'Login'}
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          // Auth screens - only show when not authenticated
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
            />
          </>
        ) : (
          // Home screen - only show when authenticated
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />
        )}
      </Stack.Navigator>
    </View>
  );
}; 