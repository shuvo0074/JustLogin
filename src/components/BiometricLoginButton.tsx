import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { biometricAuthService } from '../services/biometricAuthService';
import { authService } from '../services/authService';
import { BiometricResult, BiometricProgress } from '../types/biometric';

interface BiometricLoginButtonProps {
  onSuccess: (user: any) => void;
  onError: (error: string) => void;
  style?: any;
}

export const BiometricLoginButton: React.FC<BiometricLoginButtonProps> = ({
  onSuccess,
  onError,
  style,
}) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<string>('');

  useEffect(() => {
    checkBiometricAvailability();
    setupEventListeners();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const available = await biometricAuthService.checkAvailability();
      setIsAvailable(available);
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setIsAvailable(false);
    }
  };

  const setupEventListeners = () => {
    // Listen to progress updates
    const progressSubscription = biometricAuthService.onProgress((progress: BiometricProgress) => {
      setProgress(progress.message);
    });

    // Listen to completion
    const completeSubscription = biometricAuthService.onComplete((result: BiometricResult) => {
      if (result.success) {
        setProgress('Authentication successful!');
      } else {
        setProgress(`Authentication failed: ${result.error}`);
      }
    });

    // Cleanup subscriptions
    return () => {
      progressSubscription.remove();
      completeSubscription.remove();
    };
  };

  const handleBiometricLogin = async () => {
    if (!isAvailable) {
      Alert.alert(
        'Biometrics Not Available',
        'Biometric authentication is not available on this device.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    setProgress('Starting biometric authentication...');

    try {
      // Ensure we're on the main thread for Android
      if (Platform.OS === 'android') {
        // Small delay to ensure UI thread is ready
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const result = await authService.loginWithBiometrics();
      setProgress('Login successful!');
      onSuccess(result.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Biometric login failed';
      setProgress(`Error: ${errorMessage}`);
      onError(errorMessage);
    } finally {
      setIsLoading(false);
      // Clear progress after a delay
      setTimeout(() => setProgress(''), 3000);
    }
  };

  const getBiometricIcon = () => {
    if (Platform.OS === 'ios') {
      return '🔐'; // iOS biometric icon
    } else {
      return '👆'; // Android fingerprint icon
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Authenticating...';
    if (Platform.OS === 'ios') return 'Login with Face ID / Touch ID';
    return 'Login with Fingerprint';
  };

  if (isAvailable === false) {
    return null; // Don't show button if biometrics are not available
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleBiometricLogin}
        disabled={isLoading || isAvailable === null}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>{getBiometricIcon()}</Text>
        <Text style={styles.buttonText}>{getButtonText()}</Text>
      </TouchableOpacity>
      
      {progress && (
        <Text style={styles.progressText}>{progress}</Text>
      )}
      
      {isAvailable === null && (
        <Text style={styles.checkingText}>Checking biometric availability...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 200,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  checkingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});
