import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="info" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="PasswordPage" />
      <Stack.Screen name="onboarding-scan" />
    </Stack>
  );
}
