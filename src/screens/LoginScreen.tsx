import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../types/navigation';
import { InputField } from '../components/InputField';
import { PasswordInput } from '../components/PasswordInput';
import { Button } from '../components/Button';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const {
    handleLogin,
    isLoading,
    error,
    loginForm,
    updateLoginForm,
    clearError,
    isAuthenticated,
  } = useAuth();

  const onLoginPress = useCallback(async () => {
    try {
      const response = await handleLogin();
      // Login success is handled by the ViewModel
    } catch (error) {
      // Error is already handled by the ViewModel
    }
  }, [handleLogin]);

  const onSignupPress = useCallback(() => {
    clearError(); // Reset error state when navigating to signup
    navigation.navigate('Signup');
  }, [clearError, navigation]);

  const handleFieldChange = (field: 'email' | 'password', value: string) => {
    updateLoginForm(field, value);
  };

  // Navigate to home screen when authentication is successful
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  }, [isAuthenticated, isLoading, navigation]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="screen-Login"
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Login</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <InputField
          placeholder="Email"
          value={loginForm.email}
          onChangeText={(value) => handleFieldChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <PasswordInput
          placeholder="Password"
          value={loginForm.password}
          onChangeText={(value) => handleFieldChange('password', value)}
          autoComplete="password"
        />

        <Button
          title="Login"
          onPress={onLoginPress}
          loading={isLoading}
          disabled={isLoading}
          style={styles.loginButton}
        />

        <View style={styles.secondaryButtonContainer}>
          <Text style={styles.secondaryButtonText}>Don't have an account? </Text>
          <Button
            title="Sign up"
            variant="secondary"
            size="small"
            onPress={onSignupPress}
            disabled={isLoading}
            containerStyle={styles.signupLink}
          />
        </View>

        <Text style={styles.hint}>
          Use test@example.com / password to test
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3c3c3c',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#ffffff',
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
  loginButton: {
    marginTop: 10,
  },
  secondaryButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  signupLink: {
    marginLeft: 5,
  },
  hint: {
    textAlign: 'center',
    marginTop: 20,
    color: '#ffffff',
    fontSize: 14,
  },
}); 