export interface BiometricResult {
  success: boolean;
  error?: string;
  biometricType?: 'fingerprint' | 'face' | 'iris' | 'unknown';
  confidence?: number;
}

export interface BiometricProgress {
  message: string;
  timestamp: number;
}

export interface BiometricModuleInterface {
  authenticateWithBiometrics(): Promise<BiometricResult>;
  isBiometricsAvailable(): Promise<boolean>;
  getSupportedBiometricTypes(): Promise<string[]>;
}
