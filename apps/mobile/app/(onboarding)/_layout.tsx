import { keyValueStore } from '@/db';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);

  useEffect(() => {
    (async () => {
      const onBoardingFinished =
        await keyValueStore.isOnboardingCompleted.get();
      setIsOnboardingCompleted(onBoardingFinished);
    })();
  }, []);

  if (isOnboardingCompleted) {
    return <Redirect href={'/(tabs)/history'} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="info" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="permission" />
    </Stack>
  );
}
