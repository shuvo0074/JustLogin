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

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { 
    handleLogin, 
    isLoading, 
    error, 
    loginForm, 
    updateLoginForm,
    touchedFields,
    setFieldTouched
  } = useAuth();

  const onLoginPress = async () => {
    try {
      const response = await handleLogin();
      if (response) {
        // Only navigate if login was successful
        navigation.replace('Home');
      }
      // If response is null, login failed and error is already set in ViewModel
    } catch (error) {
      // Error is already handled by the ViewModel
      console.error('Login error:', error);
    }
  };

  const onSignupPress = () => {
    navigation.navigate('Signup');
  };

  const handleFieldChange = (field: 'email' | 'password', value: string) => {
    updateLoginForm(field, value);
  };

  const getInputStyle = (field: 'email' | 'password') => {
    const isTouched = touchedFields.login[field];
    const hasValue = loginForm[field].trim().length > 0;
    
    if (isTouched && !hasValue) {
      return [styles.input, styles.inputError];
    }
    return styles.input;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput
        style={getInputStyle('email')}
        placeholder="Email"
        value={loginForm.email}
        onChangeText={(value) => handleFieldChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
        onBlur={() => setFieldTouched('login', 'email')}
      />

      <TextInput
        style={getInputStyle('password')}
        placeholder="Password"
        value={loginForm.password}
        onChangeText={(value) => handleFieldChange('password', value)}
        secureTextEntry
        onBlur={() => setFieldTouched('login', 'password')}
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={onLoginPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onSignupPress}
        disabled={isLoading}
      >
        <Text style={styles.secondaryButtonText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Use test@example.com / password to test
      </Text>
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
  hint: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 14,
  },
}); 