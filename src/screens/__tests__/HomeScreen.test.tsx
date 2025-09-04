import React from 'react';
import { render } from '@testing-library/react-native';
import { HomeScreen } from '../HomeScreen';
import { Provider } from 'react-redux';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { configureStore } from '@reduxjs/toolkit';

describe('HomeScreen', () => {
  it('should render without crashing', () => {
    const mockStore = configureStore({
      reducer: {
        auth: (state = {
          user: null,
          isLoading: false,
          error: null,
          isAuthenticated: false,
          loginForm: { email: '', password: '' },
          signupForm: { name: '', email: '', password: '', confirmPassword: '' },
          passwordVisibility: {
            login: { password: false },
            signup: { password: false, confirmPassword: false }
          }
        }, action) => state
      }
    });

    const { getByText } = render(
      <Provider store={mockStore}>
        <LanguageProvider>
          <HomeScreen />
        </LanguageProvider>
      </Provider>
    );

    expect(getByText('Welcome!')).toBeTruthy();
  });
});
