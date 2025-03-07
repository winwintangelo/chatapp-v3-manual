import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SignInScreen from '@/app/(auth)/sign-in';

// Mock dependencies
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'auth.signIn': 'Sign In',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.dontHaveAccount': "Don't have an account?",
        'common.error': 'Error',
      };
      return translations[key] || key;
    },
  }),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: jest.fn().mockImplementation((email, password) => {
      if (email === 'test@example.com' && password === 'password123') {
        return Promise.resolve();
      }
      throw new Error('Invalid credentials');
    }),
  }),
}));

// Mock Alert.alert
jest.spyOn(Alert, 'alert');

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(<SignInScreen />);
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    const signInElements = getAllByText('Sign In');
    expect(signInElements).toHaveLength(2); // Title and button
    expect(getByText("Don't have an account?")).toBeTruthy();
  });

  it('handles successful sign in', async () => {
    const { getByPlaceholderText, getAllByText } = render(<SignInScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signInButton = getAllByText('Sign In').find(
      element => element.props.style?.color === '#fff'
    );

    expect(signInButton).toBeTruthy();
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton!);

    await waitFor(() => {
      expect(require('expo-router').router.replace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('handles sign in failure', async () => {
    const { getByPlaceholderText, getAllByText } = render(<SignInScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signInButton = getAllByText('Sign In').find(
      element => element.props.style?.color === '#fff'
    );

    expect(signInButton).toBeTruthy();
    
    fireEvent.changeText(emailInput, 'wrong@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(signInButton!);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid credentials');
    });
  });

  it('navigates to sign up screen', () => {
    const { getByText } = render(<SignInScreen />);
    
    const signUpLink = getByText("Don't have an account?");
    fireEvent.press(signUpLink);

    expect(require('expo-router').router.push).toHaveBeenCalledWith('/(auth)/sign-up');
  });

  it('updates input values correctly', () => {
    const { getByPlaceholderText } = render(<SignInScreen />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });
}); 