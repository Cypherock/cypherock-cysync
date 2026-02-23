import { LottieSplash, useTheme } from '@/components/ui';
import { Lottie } from '@/constants';
import { Stack } from 'expo-router';
import { keyValueStore } from '@/db';
import { useEffect, useState } from 'react';
import { NetworkPingTask } from '@/bgTasks/networkTask';
import { setCoreDependencies, setGlobalDependencies } from '@/utils';
import logger from '@/utils/logger';
import { runPreflightChecks } from '@/utils/preflight';

setCoreDependencies();
setGlobalDependencies();

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
        await runPreflightChecks();
      } catch (e) {
        logger.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return <LottieSplash source={Lottie.splash} />;
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
