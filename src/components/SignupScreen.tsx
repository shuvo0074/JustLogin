import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../types/navigation';

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const {
    handleSignup,
    isLoading,
    error,
    signupForm,
    updateSignupForm,
    passwordVisibility,
    toggleSignupPasswordVisibility,
    validateSignupForm,
    clearError
  } = useAuth();

  const onSignupPress = async () => {
    try {
      const response = await handleSignup();
      // Signup success is handled by the ViewModel
    } catch (error) {
      // Error is already handled by the ViewModel
    }
  };

  const onLoginPress = () => {
    clearError(); // Reset error state when navigating to login
    navigation.navigate('Login');
  };

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

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={signupForm.name}
        onChangeText={(value) => handleFieldChange('name', value)}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={signupForm.email}
        onChangeText={(value) => handleFieldChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Password"
          value={signupForm.password}
          onChangeText={(value) => handleFieldChange('password', value)}
          secureTextEntry={!passwordVisibility.signup.password}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => toggleSignupPasswordVisibility('password')}
        >
          <Text style={styles.eyeIcon}>
            {passwordVisibility.signup.password ? '🙉' : '🙈'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Confirm Password"
          value={signupForm.confirmPassword}
          onChangeText={(value) => handleFieldChange('confirmPassword', value)}
          secureTextEntry={!passwordVisibility.signup.confirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => toggleSignupPasswordVisibility('confirmPassword')}
        >
          <Text style={styles.eyeIcon}>
            {passwordVisibility.signup.confirmPassword ? '🙉' : '🙈'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={onSignupPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.secondaryButtonContainer}>
        <Text style={styles.secondaryButtonText}>Already have an account? </Text>
        <TouchableOpacity
          style={styles.loginLink}
          onPress={onLoginPress}
          disabled={isLoading}
        >
          <Text style={styles.loginLinkText}>Login</Text>
        </TouchableOpacity>
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
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#f44336',
    borderWidth: 2,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  },
  eyeIcon: {
    fontSize: 20,
    marginTop: -8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  loginLink: {
    // No styles needed for the TouchableOpacity
  },
  loginLinkText: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  secondaryButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
  fieldErrorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
}); 