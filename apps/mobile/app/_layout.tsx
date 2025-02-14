import { getDefaultTheme, getLargeTheme, LottieSplash } from '@/components/ui';
import { Slot } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import * as SystemUI from 'expo-system-ui';
import { colors } from '@/components/ui/themes/color.styled';
import { store, StoreProvider } from '@/store';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { SplashScreen } from 'expo-router';
import { LockscreenProvider } from '@/contexts/useLockscreenContext';
import { CustomRealmProvider } from '@/db';

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync(colors.background.primary);

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const [currentTheme, setCurrentTheme] = useState(getDefaultTheme());
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const largeScreenThreshold = 330;
    setCurrentTheme(
      width >= largeScreenThreshold ? getLargeTheme() : getDefaultTheme(),
    );
    setAppIsReady(true);
    SplashScreen.hide();
  }, [width]);

  if (!appIsReady) return null;

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={currentTheme}>
        <CustomRealmProvider>
          <LockscreenProvider>
            <Slot />
          </LockscreenProvider>
        </CustomRealmProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}
