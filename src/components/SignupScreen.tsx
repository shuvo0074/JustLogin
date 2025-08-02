import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
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
    touchedFields,
    setFieldTouched,
    passwordVisibility,
    toggleSignupPasswordVisibility
  } = useAuth();

  const onSignupPress = async () => {
    try {
      const response = await handleSignup();
      // If response is null, signup failed and error is already set in ViewModel
    } catch (error) {
      // Error is already handled by the ViewModel
      console.error('Signup error:', error);
    }
  };

  const onLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleFieldChange = (field: 'name' | 'email' | 'password' | 'confirmPassword', value: string) => {
    updateSignupForm(field, value);
  };

  const getInputStyle = (field: 'name' | 'email' | 'password' | 'confirmPassword') => {
    const isTouched = touchedFields.signup[field];
    const hasValue = signupForm[field].trim().length > 0;

    if (isTouched && !hasValue) {
      return [styles.input, styles.inputError];
    }
    return styles.input;
  };

  const getPasswordMatchStyle = () => {
    const isTouched = touchedFields.signup.confirmPassword;
    const hasValue = signupForm.confirmPassword.trim().length > 0;
    const passwordsMatch = signupForm.password === signupForm.confirmPassword;

    if (isTouched && hasValue && !passwordsMatch) {
      return [styles.input, styles.inputError];
    }
    return styles.input;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput
        style={getInputStyle('name')}
        placeholder="Full Name"
        value={signupForm.name}
        onChangeText={(value) => handleFieldChange('name', value)}
        autoCapitalize="words"
        onBlur={() => setFieldTouched('signup', 'name')}
      />

      <TextInput
        style={getInputStyle('email')}
        placeholder="Email"
        value={signupForm.email}
        onChangeText={(value) => handleFieldChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        onBlur={() => setFieldTouched('signup', 'email')}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={[getInputStyle('password'), styles.passwordInput]}
          placeholder="Password"
          value={signupForm.password}
          onChangeText={(value) => handleFieldChange('password', value)}
          secureTextEntry={!passwordVisibility.signup.password}
          onBlur={() => setFieldTouched('signup', 'password')}
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
          style={[getPasswordMatchStyle(), styles.passwordInput]}
          placeholder="Confirm Password"
          value={signupForm.confirmPassword}
          onChangeText={(value) => handleFieldChange('confirmPassword', value)}
          secureTextEntry={!passwordVisibility.signup.confirmPassword}
          onBlur={() => setFieldTouched('signup', 'confirmPassword')}
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
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onLoginPress}
        disabled={isLoading}
      >
        <Text style={styles.secondaryButtonText}>Already have an account? Login</Text>
      </TouchableOpacity>
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
}); 