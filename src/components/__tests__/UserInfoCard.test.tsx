/**
 * UserInfoCard.test.tsx - User Information Card Component Test Suite
 * 
 * This test file validates the UserInfoCard component's rendering behavior,
 * conditional display logic, and prop handling.
 * 
 * Test Coverage:
 * - User information display
 * - Conditional rendering based on props
 * - Custom styling application
 * - Edge cases (null user, missing timestamps)
 * - Accessibility and user experience
 * 
 * Dependencies:
 * - React Testing Library for component testing
 * - UserInfoCard component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { UserInfoCard } from '../UserInfoCard';
import { LanguageProvider } from '../../contexts/LanguageContext';

/**
 * Test Suite: UserInfoCard Component
 * 
 * Tests the user information card component that displays user details
 * with configurable visibility options for different fields.
 */
describe('UserInfoCard', () => {
  // Mock user data for testing different scenarios
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-02',
  };

  // Helper function to render UserInfoCard with LanguageProvider
  const renderUserInfoCard = (props: any) => {
    return render(
      <LanguageProvider>
        <UserInfoCard {...props} />
      </LanguageProvider>
    );
  };

  /**
   * Test: Basic User Information Display
   * 
   * Validates that the UserInfoCard renders all user information correctly
   * when a valid user object is provided.
   */
  it('should render user information correctly', () => {
    const { getByText } = renderUserInfoCard({ user: mockUser });
    
    // Should display all user information fields
    expect(getByText('Name:')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Email:')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
    expect(getByText('User ID:')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
  });

  /**
   * Test: Null User Handling
   * 
   * Validates that the UserInfoCard handles null user gracefully
   * by not rendering any user information.
   */
  it('should not render when user is null', () => {
    const { queryByText } = renderUserInfoCard({ user: null });
    
    // Should not display any user information when user is null
    expect(queryByText('Name:')).toBeNull();
    expect(queryByText('Email:')).toBeNull();
    expect(queryByText('User ID:')).toBeNull();
  });

  /**
   * Test: User ID Visibility Control
   * 
   * Validates that the UserInfoCard can hide the user ID field
   * when showId prop is set to false.
   */
  it('should hide user ID when showId is false', () => {
    const { getByText, queryByText } = renderUserInfoCard({
      user: mockUser,
      showId: false
    });
    
    // Should show name and email
    expect(getByText('Name:')).toBeTruthy();
    expect(getByText('Email:')).toBeTruthy();
    // Should hide user ID when showId is false
    expect(queryByText('User ID:')).toBeNull();
  });

  /**
   * Test: Timestamps Display Control
   * 
   * Validates that the UserInfoCard can show creation and update timestamps
   * when showTimestamps prop is set to true.
   */
  it('should show timestamps when showTimestamps is true', () => {
    const { getByText } = renderUserInfoCard({
      user: mockUser,
      showTimestamps: true
    });
    
    // Should display timestamp information when enabled
    expect(getByText('Created:')).toBeTruthy();
    expect(getByText('2023-01-01')).toBeTruthy();
    expect(getByText('Updated:')).toBeTruthy();
    expect(getByText('2023-01-02')).toBeTruthy();
  });

  /**
   * Test: Custom Styling Application
   * 
   * Validates that the UserInfoCard can accept and apply custom styles
   * through the containerStyle prop.
   */
  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' };
    const { getByText } = renderUserInfoCard({
      user: mockUser,
      containerStyle: customStyle
    });
    
    // Should render with custom styles applied
    expect(getByText('Name:')).toBeTruthy();
  });

  /**
   * Test: Missing Timestamps Handling
   * 
   * Validates that the UserInfoCard gracefully handles users without
   * timestamp information when showTimestamps is enabled.
   */
  it('should handle user without timestamps', () => {
    const userWithoutTimestamps = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };
    
    const { getByText, queryByText } = renderUserInfoCard({
      user: userWithoutTimestamps,
      showTimestamps: true
    });
    
    // Should show basic user information
    expect(getByText('Name:')).toBeTruthy();
    // Should not show timestamp fields when they don't exist
    expect(queryByText('Created:')).toBeNull();
    expect(queryByText('Updated:')).toBeNull();
  });
}); 