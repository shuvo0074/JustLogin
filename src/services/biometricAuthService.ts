import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { BiometricResult, BiometricProgress, BiometricModuleInterface } from '../types/biometric';

const { BiometricModule } = NativeModules;

// Type-safe wrapper for the native module
const biometricModule: BiometricModuleInterface = {
  authenticateWithBiometrics: BiometricModule.authenticateWithBiometrics,
  isBiometricsAvailable: BiometricModule.isBiometricsAvailable,
  getSupportedBiometricTypes: BiometricModule.getSupportedBiometricTypes,
};

class BiometricAuthService {
  private eventEmitter: NativeEventEmitter;
  private isAvailable: boolean | null = null;

  constructor() {
    this.eventEmitter = new NativeEventEmitter(BiometricModule);
  }

  /**
   * Check if biometric authentication is available on the device
   */
  async checkAvailability(): Promise<boolean> {
    if (this.isAvailable !== null) {
      return this.isAvailable;
    }

    try {
      this.isAvailable = await biometricModule.isBiometricsAvailable();
      return this.isAvailable;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      this.isAvailable = false;
      return false;
    }
  }

  /**
   * Get supported biometric types on the device
   */
  async getSupportedTypes(): Promise<string[]> {
    try {
      return await biometricModule.getSupportedBiometricTypes();
    } catch (error) {
      console.error('Error getting supported biometric types:', error);
      return [];
    }
  }

  /**
   * Authenticate using biometrics
   */
  async authenticate(): Promise<BiometricResult> {
    try {
      const isAvailable = await this.checkAvailability();
      if (!isAvailable) {
        throw new Error('Biometric authentication not available on this device');
      }

      return await biometricModule.authenticateWithBiometrics();
    } catch (error) {
      console.error('Biometric authentication error:', error);
      
      // Handle Android-specific thread errors
      if (error instanceof Error && error.message.includes('main thread')) {
        throw new Error('Biometric authentication must be initiated from the main thread. Please try again.');
      }
      
      throw error;
    }
  }

  /**
   * Listen to authentication progress updates
   */
  onProgress(callback: (progress: BiometricProgress) => void) {
    return this.eventEmitter.addListener('onAuthenticationProgress', (message: string) => {
      callback({
        message,
        timestamp: Date.now(),
      });
    });
  }

  /**
   * Listen to authentication completion
   */
  onComplete(callback: (result: BiometricResult) => void) {
    return this.eventEmitter.addListener('onAuthenticationComplete', callback);
  }

  /**
   * Get platform-specific information
   */
  getPlatformInfo() {
    return {
      platform: Platform.OS,
      version: Platform.Version,
    };
  }

  /**
   * Check if the device supports the specified biometric type
   */
  async supportsBiometricType(type: string): Promise<boolean> {
    try {
      const supportedTypes = await this.getSupportedTypes();
      return supportedTypes.includes(type);
    } catch (error) {
      console.error('Error checking biometric type support:', error);
      return false;
    }
  }
}

export const biometricAuthService = new BiometricAuthService();
