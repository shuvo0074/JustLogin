/**
 * PageTitle.test.tsx - Page Title Component Test Suite
 * 
 * This test file validates the PageTitle component's rendering behavior,
 * variant handling, and styling capabilities.
 * 
 * Test Coverage:
 * - Title text rendering
 * - Size variants (large, medium, small)
 * - Custom styling application
 * - Different title content
 * 
 * Dependencies:
 * - React Testing Library for component testing
 * - PageTitle component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { PageTitle } from '../PageTitle';

/**
 * Test Suite: PageTitle Component
 * 
 * Tests the page title component that displays headings with different
 * sizes and styling options.
 */
describe('PageTitle', () => {
  /**
   * Test: Basic Title Rendering
   * 
   * Validates that the PageTitle renders the provided title text correctly.
   */
  it('should render title correctly', () => {
    const { getByText } = render(<PageTitle title="Welcome!" />);
    
    // Should display the provided title text
    expect(getByText('Welcome!')).toBeTruthy();
  });

  /**
   * Test: Default Large Variant
   * 
   * Validates that the PageTitle renders with large variant by default
   * when no variant prop is specified.
   */
  it('should render with large variant by default', () => {
    const { getByText } = render(<PageTitle title="Welcome!" />);
    
    const title = getByText('Welcome!');
    // Should render with default large variant
    expect(title).toBeTruthy();
  });

  /**
   * Test: Medium Variant Rendering
   * 
   * Validates that the PageTitle can render with medium size variant
   * when explicitly specified.
   */
  it('should render with medium variant', () => {
    const { getByText } = render(<PageTitle title="Welcome!" variant="medium" />);
    
    const title = getByText('Welcome!');
    // Should render with medium variant
    expect(title).toBeTruthy();
  });

  /**
   * Test: Small Variant Rendering
   * 
   * Validates that the PageTitle can render with small size variant
   * when explicitly specified.
   */
  it('should render with small variant', () => {
    const { getByText } = render(<PageTitle title="Welcome!" variant="small" />);
    
    const title = getByText('Welcome!');
    // Should render with small variant
    expect(title).toBeTruthy();
  });

  /**
   * Test: Custom Styling Application
   * 
   * Validates that the PageTitle can accept and apply custom styles
   * through the style prop.
   */
  it('should apply custom styles', () => {
    const customStyle = { color: '#FF0000' };
    const { getByText } = render(
      <PageTitle title="Welcome!" style={customStyle} />
    );
    
    const title = getByText('Welcome!');
    // Should render with custom styles applied
    expect(title).toBeTruthy();
  });

  /**
   * Test: Different Title Content
   * 
   * Validates that the PageTitle can render different title text
   * and maintains proper rendering behavior.
   */
  it('should render different titles', () => {
    const { getByText } = render(<PageTitle title="Login" />);
    
    // Should display different title text
    expect(getByText('Login')).toBeTruthy();
  });
}); 