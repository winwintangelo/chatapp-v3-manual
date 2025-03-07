import { Stack } from 'expo-router';
import { Slot } from 'expo-router';
import { View } from 'react-native';

export default function SettingsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
} 