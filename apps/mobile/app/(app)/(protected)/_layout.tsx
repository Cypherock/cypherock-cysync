import { LottieSplash, useTheme } from '@/components/ui';
import { Stack } from 'expo-router';
import { keyValueStore } from '@/db';
import { useEffect, useState } from 'react';
import { SplashScreen } from 'expo-router';
import { NetworkPingTask } from '@/bgTasks/networkTask';

export default function Layout() {
  const [onBoaridngCompleted, setOnBoardingCompleted] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const theme = useTheme();

  async function getOnboardingStatus() {
    const onBoardingStatus = await keyValueStore.isOnboardingCompleted.get();
    setOnBoardingCompleted(onBoardingStatus);
  }

  useEffect(() => {
    async function prepare() {
      try {
        await getOnboardingStatus();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return <LottieSplash source={require('@/assets/lottie/splash.json')} />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.palette.background.primary },
        }}
      >
        <Stack.Screen name="(onboarding)" redirect={onBoaridngCompleted} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="permission" />
        <Stack.Screen name="scan" />
      </Stack>
      <NetworkPingTask />
    </>
  );
}
