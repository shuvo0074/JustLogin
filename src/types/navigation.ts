import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

export type AuthStackNavigationProp = StackNavigationProp<RootStackParamList>; 