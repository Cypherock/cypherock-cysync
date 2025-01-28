import { getDefaultTheme, getLargeTheme } from '@/components/ui';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import * as SystemUI from 'expo-system-ui';
import { colors } from '@/components/ui/themes/color.styled';
import { store, StoreProvider } from '@/store';
import { CustomRealmProvider, keyValueStore } from '@/db';
import { BgTasks } from '@/components/core';
import React, { useEffect, useState, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { SplashScreen } from 'expo-router';

SystemUI.setBackgroundColorAsync(colors.background.primary);
SplashScreen.preventAutoHideAsync();

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
    return null;
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
          <BgTasks />
        </CustomRealmProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
