import { getDefaultTheme, getLargeTheme } from '@/components/ui';
import { Stack } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import * as SystemUI from 'expo-system-ui';
import { colors } from '@/components/ui/themes/color.styled';
import { store, StoreProvider } from '@/store';
import { CustomRealmProvider } from '@/db';
import { BgTasks } from '@/components/core';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

SystemUI.setBackgroundColorAsync(colors.background.primary);

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const [currentTheme, setCurrentTheme] = useState(getDefaultTheme());

  useEffect(() => {
    const largeScreenThreshold = 330;
    setCurrentTheme(
      width >= largeScreenThreshold ? getLargeTheme() : getDefaultTheme(),
    );
  }, [width]);

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
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="scan" />
          </Stack>
          <BgTasks />
        </CustomRealmProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
