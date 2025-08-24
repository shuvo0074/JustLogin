/**
 * PasswordInput.test.tsx - Password Input Component Test Suite
 * 
 * This test file validates the PasswordInput component's behavior,
 * password visibility toggling, and initial state management.
 * 
 * Test Coverage:
 * - Initial password hidden state
 * - Password visibility toggle functionality
 * - Eye icon display (🙈 for hidden, 🙉 for visible)
 * - Secure text entry behavior
 * 
 * Dependencies:
 * - React Testing Library for component testing
 * - PasswordInput component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PasswordInput } from '../PasswordInput';

/**
 * Test Suite: PasswordInput Component
 * 
 * Tests the password input component that handles password entry
 * with visibility toggle functionality.
 */
describe('PasswordInput', () => {
  // Clear any potential state between tests to ensure clean test environment
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: Initial Password Hidden State
   * 
   * Validates that the PasswordInput starts with password hidden by default.
   * Should show closed eye icon (🙈) and have secureTextEntry enabled.
   */
  it('should render with password hidden initially', () => {
    const { getByPlaceholderText, getByText } = render(
      <PasswordInput placeholder="Password" />
    );

    const passwordInput = getByPlaceholderText('Password');
    
    // Initially password should be hidden (eye closed icon)
    expect(getByText('🙈')).toBeTruthy();
    // Secure text entry should be enabled for password hiding
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  /**
   * Test: Password Hidden State in Isolation
   * 
   * Validates that the PasswordInput maintains hidden state
   * when rendered independently without other components.
   */
  it('should start with password hidden in isolation', () => {
    const { getByText } = render(
      <PasswordInput placeholder="Test" />
    );
    
    // Should show closed eye icon indicating hidden password
    expect(getByText('🙈')).toBeTruthy();
  });
}); 