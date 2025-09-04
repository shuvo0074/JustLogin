import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../types/navigation';
import { InputField } from '../components/InputField';
import { PasswordInput } from '../components/PasswordInput';
import { Button } from '../components/Button';

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const {
    handleSignup,
    isLoading,
    error,
    signupForm,
    updateSignupForm,
    clearError
  } = useAuth();

  const onSignupPress = useCallback(async () => {
    try {
      const response = await handleSignup();
      // Signup success is handled by the ViewModel
    } catch (error) {
      // Error is already handled by the ViewModel
    }
  }, [handleSignup]);

  const onLoginPress = useCallback(() => {
    clearError(); // Reset error state when navigating to login
    navigation.navigate('Login');
  }, [clearError, navigation]);

  const handleFieldChange = (field: 'name' | 'email' | 'password' | 'confirmPassword', value: string) => {
    updateSignupForm(field, value);
  };

  return (
    <View style={styles.container} testID="screen-Signup">
      <Text style={styles.title}>Create Account</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <InputField
        placeholder="Full Name"
        value={signupForm.name}
        onChangeText={(value) => handleFieldChange('name', value)}
        autoCapitalize="words"
        autoComplete="name"
      />

      <InputField
        placeholder="Email"
        value={signupForm.email}
        onChangeText={(value) => handleFieldChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <PasswordInput
        placeholder="Password"
        value={signupForm.password}
        onChangeText={(value) => handleFieldChange('password', value)}
        autoComplete="new-password"
      />

      <PasswordInput
        placeholder="Confirm Password"
        value={signupForm.confirmPassword}
        onChangeText={(value) => handleFieldChange('confirmPassword', value)}
        autoComplete="new-password"
      />

      <Button
        title="Create Account"
        onPress={onSignupPress}
        loading={isLoading}
        disabled={isLoading}
        style={styles.signupButton}
      />

      <View style={styles.secondaryButtonContainer}>
        <Text style={styles.secondaryButtonText}>Already have an account? </Text>
        <Button
          title="Login"
          variant="secondary"
          size="small"
          onPress={onLoginPress}
          disabled={isLoading}
          containerStyle={styles.loginLink}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    textAlign: 'center',
  },
  signupButton: {
    marginTop: 10,
  },
  secondaryButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    marginLeft: 5,
  },
}); 