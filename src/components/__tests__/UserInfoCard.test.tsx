import React from 'react';
import { render } from '@testing-library/react-native';
import { UserInfoCard } from '../UserInfoCard';

describe('UserInfoCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-02',
  };

  it('should render user information correctly', () => {
    const { getByText } = render(<UserInfoCard user={mockUser} />);
    
    expect(getByText('Name:')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Email:')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
    expect(getByText('User ID:')).toBeTruthy();
    expect(getByText('1')).toBeTruthy();
  });

  it('should not render when user is null', () => {
    const { queryByText } = render(<UserInfoCard user={null} />);
    
    expect(queryByText('Name:')).toBeNull();
    expect(queryByText('Email:')).toBeNull();
    expect(queryByText('User ID:')).toBeNull();
  });

  it('should hide user ID when showId is false', () => {
    const { getByText, queryByText } = render(
      <UserInfoCard user={mockUser} showId={false} />
    );
    
    expect(getByText('Name:')).toBeTruthy();
    expect(getByText('Email:')).toBeTruthy();
    expect(queryByText('User ID:')).toBeNull();
  });

  it('should show timestamps when showTimestamps is true', () => {
    const { getByText } = render(
      <UserInfoCard user={mockUser} showTimestamps={true} />
    );
    
    expect(getByText('Created:')).toBeTruthy();
    expect(getByText('2023-01-01')).toBeTruthy();
    expect(getByText('Updated:')).toBeTruthy();
    expect(getByText('2023-01-02')).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const customStyle = { backgroundColor: '#f0f0f0' };
    const { getByText } = render(
      <UserInfoCard user={mockUser} containerStyle={customStyle} />
    );
    
    expect(getByText('Name:')).toBeTruthy();
  });

  it('should handle user without timestamps', () => {
    const userWithoutTimestamps = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };
    
    const { getByText, queryByText } = render(
      <UserInfoCard user={userWithoutTimestamps} showTimestamps={true} />
    );
    
    expect(getByText('Name:')).toBeTruthy();
    expect(queryByText('Created:')).toBeNull();
    expect(queryByText('Updated:')).toBeNull();
  });
}); 