// Simple environment configuration for React Native
// This avoids the compatibility issues with react-native-dotenv

// Get backend IP from environment variable or use default
const getBackendIP = (): string => {
  // Check for custom IP set via environment variable
  if (process.env.REACT_NATIVE_BACKEND_IP) {
    return process.env.REACT_NATIVE_BACKEND_IP;
  }

  // In development, use localhost for simulator/emulator
  // In production, use the production API
  return __DEV__ ? 'localhost' : 'https://10.144.43.24';
};

const config = {
  development: {
    API_BASE_URL: `http://${getBackendIP()}:8080/api/v1`,
    API_KEY: 'dev_api_key_123',
    AUTH_SECRET: 'dev_auth_secret_456',
    DEBUG: true,
    LOG_LEVEL: 'debug',
  },
  production: {
    // Allow overriding production API host at build time using
    // REACT_NATIVE_BACKEND_IP (e.g. REACT_NATIVE_BACKEND_IP=10.144.43.24)
    // When provided, we assume an HTTP backend on port 8080 for local testing.
    API_BASE_URL: process.env.REACT_NATIVE_BACKEND_IP
      ? `http://${process.env.REACT_NATIVE_BACKEND_IP}:8080/api/v1`
      : 'https://api.gymapp.com/api/v1',
    API_KEY: 'prod_api_key_789',
    AUTH_SECRET: 'prod_auth_secret_101',
    DEBUG: false,
    LOG_LEVEL: 'info',
  },
};

// Get current environment (default to development)
const getCurrentEnvironment = () => {
  // In React Native, you can use __DEV__ to detect development mode
  return __DEV__ ? 'development' : 'production';
};

const currentConfig = config[getCurrentEnvironment()];

// Export individual values for easy importing
export const API_BASE_URL = currentConfig.API_BASE_URL;
export const API_KEY = currentConfig.API_KEY;
export const AUTH_SECRET = currentConfig.AUTH_SECRET;
export const DEBUG = currentConfig.DEBUG;
export const LOG_LEVEL = currentConfig.LOG_LEVEL;
export const ENVIRONMENT = {...currentConfig, ENVIRONMENT: getCurrentEnvironment()};

// Export the full config if needed
export default currentConfig;

// Export helper function for IP configuration
export const setBackendIP = (ip: string) => {
  process.env.REACT_NATIVE_BACKEND_IP = ip;
  console.log(`Backend IP set to: ${ip}`);
};
