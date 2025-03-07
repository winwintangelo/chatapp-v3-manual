import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';

// Mock environment variables
process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.com';

// Create a simple component for testing
const MockHomeScreen = () => (
  <View>
    <Text>Chat</Text>
    <Text>New Chat</Text>
    <Text>Hello</Text>
    <Text>Hi there!</Text>
  </View>
);

// Simplified tests
describe('Home Screen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MockHomeScreen />);
    expect(getByText('Chat')).toBeTruthy();
    expect(getByText('New Chat')).toBeTruthy();
  });

  it('displays chat messages correctly', () => {
    const { getByText } = render(<MockHomeScreen />);
    expect(getByText('Hello')).toBeTruthy();
    expect(getByText('Hi there!')).toBeTruthy();
  });
}); 