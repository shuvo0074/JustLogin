import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PasswordInput } from '../PasswordInput';

describe('PasswordInput', () => {
  beforeEach(() => {
    // Clear any potential state between tests
    jest.clearAllMocks();
  });

  it('should render with password hidden initially', () => {
    const { getByPlaceholderText, getByText } = render(
      <PasswordInput placeholder="Password" />
    );

    const passwordInput = getByPlaceholderText('Password');
    
    // Initially password should be hidden (eye closed)
    expect(getByText('🙈')).toBeTruthy();
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('should start with password hidden in isolation', () => {
    const { getByText } = render(
      <PasswordInput placeholder="Test" />
    );
    
    expect(getByText('🙈')).toBeTruthy();
  });
}); 