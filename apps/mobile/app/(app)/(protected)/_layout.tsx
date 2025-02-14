import { LottieSplash } from '@/components/ui';
import { Stack } from 'expo-router';
import { CustomRealmProvider, keyValueStore } from '@/db';
import React, { useEffect, useState } from 'react';
import { SplashScreen } from 'expo-router';
import { BackgroundTasks } from '@/bgTasks';

export default function Layout() {
  const [onBoaridngCompleted, setOnBoardingCompleted] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

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
        SplashScreen.hide();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return <LottieSplash source={require('@/assets/lottie/splash.json')} />;
  }

  return (
    <CustomRealmProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(onboarding)" redirect={onBoaridngCompleted} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="permission" />
        <Stack.Screen name="scan" />
      </Stack>
      <BackgroundTasks />
    </CustomRealmProvider>
  );
}
