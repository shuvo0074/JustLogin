import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { BiometricLoginButton } from '../BiometricLoginButton';
import { biometricAuthService } from '../../services/biometricAuthService';

// Mock the biometric auth service
jest.mock('../../services/biometricAuthService');
const mockBiometricAuthService = biometricAuthService as jest.Mocked<typeof biometricAuthService>;

describe('BiometricLoginButton', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockBiometricAuthService.checkAvailability.mockResolvedValue(true);
  });

  it('renders correctly when biometrics are available', async () => {
    const { getByText } = render(
      <BiometricLoginButton onSuccess={mockOnSuccess} onError={mockOnError} />
    );

    await waitFor(() => {
      expect(getByText(/Login with/)).toBeTruthy();
    });
  });

  it('shows loading state when authenticating', async () => {
    mockBiometricAuthService.authenticate.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    const { getByText } = render(
      <BiometricLoginButton onSuccess={mockOnSuccess} onError={mockOnError} />
    );

    const button = getByText(/Login with/);
    fireEvent.press(button);

    await waitFor(() => {
      expect(getByText('Authenticating...')).toBeTruthy();
    });
  });

  it('calls onSuccess when authentication succeeds', async () => {
    const mockUser = { id: '1', name: 'Test User' };
    mockBiometricAuthService.authenticate.mockResolvedValue({
      success: true,
      biometricType: 'fingerprint',
      confidence: 0.95,
    });

    const { getByText } = render(
      <BiometricLoginButton onSuccess={mockOnSuccess} onError={mockOnError} />
    );

    const button = getByText(/Login with/);
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('calls onError when authentication fails', async () => {
    mockBiometricAuthService.authenticate.mockRejectedValue(
      new Error('Authentication failed')
    );

    const { getByText } = render(
      <BiometricLoginButton onSuccess={mockOnSuccess} onError={mockOnError} />
    );

    const button = getByText(/Login with/);
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Biometric login failed: Authentication failed');
    });
  });

  it('does not render when biometrics are not available', async () => {
    mockBiometricAuthService.checkAvailability.mockResolvedValue(false);

    const { queryByText } = render(
      <BiometricLoginButton onSuccess={mockOnSuccess} onError={mockOnError} />
    );

    await waitFor(() => {
      expect(queryByText(/Login with/)).toBeNull();
    });
  });
});
