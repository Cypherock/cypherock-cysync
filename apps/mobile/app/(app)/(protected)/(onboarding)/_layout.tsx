import { useLockscreen } from '@/contexts/useLockscreenContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const { isPasswordSet } = useLockscreen();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="password-page" redirect={isPasswordSet} />
      <Stack.Screen name="onboarding-scan" />
      <Stack.Screen name="sync" />
    </Stack>
  );
}
