import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    const { getByText } = render(<LoadingSpinner />);
    
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should render with custom message', () => {
    const { getByText } = render(<LoadingSpinner message="Please wait..." />);
    
    expect(getByText('Please wait...')).toBeTruthy();
  });

  it('should render with different sizes', () => {
    const { getByText } = render(<LoadingSpinner size="small" />);
    
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should render with custom color', () => {
    const { getByText } = render(<LoadingSpinner color="#FF0000" />);
    
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: '#000' };
    const { getByText } = render(
      <LoadingSpinner containerStyle={customStyle} />
    );
    
    expect(getByText('Loading...')).toBeTruthy();
  });
}); 