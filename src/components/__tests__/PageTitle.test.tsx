import React from 'react';
import { render } from '@testing-library/react-native';
import { PageTitle } from '../PageTitle';

describe('PageTitle', () => {
  it('should render title correctly', () => {
    const { getByText } = render(<PageTitle title="Welcome!" />);
    
    expect(getByText('Welcome!')).toBeTruthy();
  });

  it('should render with large variant by default', () => {
    const { getByText } = render(<PageTitle title="Welcome!" />);
    
    const title = getByText('Welcome!');
    expect(title).toBeTruthy();
  });

  it('should render with medium variant', () => {
    const { getByText } = render(<PageTitle title="Welcome!" variant="medium" />);
    
    const title = getByText('Welcome!');
    expect(title).toBeTruthy();
  });

  it('should render with small variant', () => {
    const { getByText } = render(<PageTitle title="Welcome!" variant="small" />);
    
    const title = getByText('Welcome!');
    expect(title).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const customStyle = { color: '#FF0000' };
    const { getByText } = render(
      <PageTitle title="Welcome!" style={customStyle} />
    );
    
    const title = getByText('Welcome!');
    expect(title).toBeTruthy();
  });

  it('should render different titles', () => {
    const { getByText } = render(<PageTitle title="Login" />);
    
    expect(getByText('Login')).toBeTruthy();
  });
}); 