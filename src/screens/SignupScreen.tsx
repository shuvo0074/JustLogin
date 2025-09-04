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
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../types/navigation';
import { InputField } from '../components/InputField';
import { PasswordInput } from '../components/PasswordInput';
import { Button } from '../components/Button';

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { t } = useLanguage();
  const {
    handleSignup,
    isLoading,
    error,
    signupForm,
    updateSignupForm,
    clearError,
    isAuthenticated,
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

  // Navigate to main tabs when authentication is successful
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    }
  }, [isAuthenticated, isLoading, navigation]);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="screen-Signup"
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t.signupTitle}</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <InputField
          placeholder={t.name}
          value={signupForm.name}
          onChangeText={(value) => handleFieldChange('name', value)}
          autoCapitalize="words"
          autoComplete="name"
        />

        <InputField
          placeholder={t.email}
          value={signupForm.email}
          onChangeText={(value) => handleFieldChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />

        <PasswordInput
          placeholder={t.password}
          value={signupForm.password}
          onChangeText={(value) => handleFieldChange('password', value)}
          autoComplete="new-password"
        />

        <PasswordInput
          placeholder={t.confirmPassword}
          value={signupForm.confirmPassword}
          onChangeText={(value) => handleFieldChange('confirmPassword', value)}
          autoComplete="new-password"
        />

        <Button
          title={t.signupButton}
          onPress={onSignupPress}
          loading={isLoading}
          disabled={isLoading}
          style={styles.signupButton}
        />

        <View style={styles.secondaryButtonContainer}>
          <Text style={styles.secondaryButtonText}>{t.alreadyHaveAccount}</Text>
          <Button
            title={t.loginLink}
            variant="secondary"
            size="small"
            onPress={onLoginPress}
            disabled={isLoading}
            containerStyle={styles.loginLink}
          />
        </View>
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
    color: '#ffffff',
    fontSize: 16,
  },
  loginLink: {
    marginLeft: 5,
  },
}); 