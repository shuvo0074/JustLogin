import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { LoginScreen } from '../components/LoginScreen';
import { SignupScreen } from '../components/SignupScreen';
import { HomeScreen } from '../components/HomeScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export const AuthNavigator: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Home' : 'Login'}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}; 