import { getDefaultTheme, getLargeTheme, LottieSplash } from '@/components/ui';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import * as SystemUI from 'expo-system-ui';
import { colors } from '@/components/ui/themes/color.styled';
import { store, StoreProvider } from '@/store';
import { CustomRealmProvider, keyValueStore } from '@/db';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { SplashScreen } from 'expo-router';
import { BackgroundTasks } from '@/bgTasks';

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync(colors.background.primary);

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const [currentTheme, setCurrentTheme] = useState(getDefaultTheme());
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

  useEffect(() => {
    const largeScreenThreshold = 330;
    setCurrentTheme(
      width >= largeScreenThreshold ? getLargeTheme() : getDefaultTheme(),
    );
  }, [width]);

  if (!appIsReady) {
    return <LottieSplash source={require('@/assets/lottie/splash.json')} />;
  }

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={currentTheme}>
        <CustomRealmProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background.primary },
            }}
          >
            <Stack.Screen name="(onboarding)" redirect={onBoaridngCompleted} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="permission" />
            <Stack.Screen name="scan" />
          </Stack>
          <BackgroundTasks />
        </CustomRealmProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
