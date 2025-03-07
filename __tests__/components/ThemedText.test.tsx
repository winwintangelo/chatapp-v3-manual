import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '@/components/ThemedText';

// Mock the useThemeColor hook
jest.mock('@/hooks/useThemeColor', () => ({
  useThemeColor: () => '#000000',
}));

describe('ThemedText', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<ThemedText>Test Text</ThemedText>);
    const textElement = getByText('Test Text');
    expect(textElement).toBeTruthy();
  });

  it('applies different text types correctly', () => {
    const types = ['default', 'title', 'defaultSemiBold', 'subtitle', 'link'] as const;
    
    types.forEach((type) => {
      const { getByText } = render(
        <ThemedText type={type}>Test {type}</ThemedText>
      );
      const textElement = getByText(`Test ${type}`);
      expect(textElement).toBeTruthy();
      
      // Check if styles are applied based on type
      const style = textElement.props.style.find((s: any) => 
        s && (s.fontSize || s.fontWeight || s.lineHeight)
      );
      expect(style).toBeTruthy();
    });
  });

  it('accepts and applies custom style prop', () => {
    const customStyle = { marginTop: 10 };
    const { getByText } = render(
      <ThemedText style={customStyle}>Custom Style Text</ThemedText>
    );
    const textElement = getByText('Custom Style Text');
    expect(textElement.props.style.some((s: any) => s && s.marginTop === 10)).toBeTruthy();
  });
}); 