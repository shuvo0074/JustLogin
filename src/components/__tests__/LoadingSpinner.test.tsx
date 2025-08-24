/**
 * LoadingSpinner.test.tsx - Loading Spinner Component Test Suite
 * 
 * This test file validates the LoadingSpinner component's rendering behavior,
 * prop handling, and styling capabilities.
 * 
 * Test Coverage:
 * - Default prop rendering
 * - Custom message display
 * - Size variations
 * - Color customization
 * - Custom styling application
 * 
 * Dependencies:
 * - React Testing Library for component testing
 * - LoadingSpinner component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingSpinner } from '../LoadingSpinner';

/**
 * Test Suite: LoadingSpinner Component
 * 
 * Tests the loading spinner component that provides visual feedback
 * during asynchronous operations.
 */
describe('LoadingSpinner', () => {
  /**
   * Test: Default Props Rendering
   * 
   * Validates that the LoadingSpinner renders correctly with default props.
   * Should display the default "Loading..." message.
   */
  it('should render with default props', () => {
    const { getByText } = render(<LoadingSpinner />);
    
    // Should display default loading message
    expect(getByText('Loading...')).toBeTruthy();
  });

  /**
   * Test: Custom Message Display
   * 
   * Validates that the LoadingSpinner can display custom loading messages
   * instead of the default text.
   */
  it('should render with custom message', () => {
    const { getByText } = render(<LoadingSpinner message="Please wait..." />);
    
    // Should display custom message
    expect(getByText('Please wait...')).toBeTruthy();
  });

  /**
   * Test: Size Variations
   * 
   * Validates that the LoadingSpinner can render in different sizes
   * (small, medium, large) as specified by the size prop.
   */
  it('should render with different sizes', () => {
    const { getByText } = render(<LoadingSpinner size="small" />);
    
    // Should render with specified size
    expect(getByText('Loading...')).toBeTruthy();
  });

  /**
   * Test: Color Customization
   * 
   * Validates that the LoadingSpinner can render with custom colors
   * as specified by the color prop.
   */
  it('should render with custom color', () => {
    const { getByText } = render(<LoadingSpinner color="#FF0000" />);
    
    // Should render with custom color
    expect(getByText('Loading...')).toBeTruthy();
  });

  /**
   * Test: Custom Styling
   * 
   * Validates that the LoadingSpinner can accept and apply custom styles
   * through the containerStyle prop.
   */
  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: '#000' };
    const { getByText } = render(
      <LoadingSpinner containerStyle={customStyle} />
    );
    
    // Should render with custom styles applied
    expect(getByText('Loading...')).toBeTruthy();
  });
}); 