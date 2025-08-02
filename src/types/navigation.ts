import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};

export type AuthStackNavigationProp = StackNavigationProp<RootStackParamList>; 