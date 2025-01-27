import { getDefaultTheme } from '@/components/ui/themes';
import { Slot, Stack } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import * as SystemUI from 'expo-system-ui';
import { colors } from '@/components/ui/themes/color.styled';
import { store, StoreProvider } from '@/store';
import { CustomRealmProvider } from '@/db';
import { BgTasks } from '@/components/core/BgTasks';
import React from 'react';

SystemUI.setBackgroundColorAsync(colors.background.primary);

export default function RootLayout() {
  const theme = getDefaultTheme();

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={theme}>
        <CustomRealmProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background.primary },
            }}
          >
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Slot />
          </Stack>
          <BgTasks />
        </CustomRealmProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
