import {
  getDefaultTheme,
  getLargeTheme,
  LottieSplash,
  ThemeType,
} from '@/components/ui';
import { ErrorBoundaryProps, Slot } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import * as SystemUI from 'expo-system-ui';
import { colors } from '@/components/ui/themes/color.styled';
import { store, StoreProvider } from '@/store';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { SplashScreen } from 'expo-router';
import {
  LockscreenProvider,
  useLockscreen,
} from '@/contexts/useLockscreenContext';
import { CurrencyProvider } from '@/contexts/useCurrencyContext';
import { CustomRealmProvider } from '@/db';
import { NavigationLogger } from '@/components/core';
import '../utils/firebase';

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync(colors.background.primary);

export default function RootLayout() {
  const [currentTheme, setCurrentTheme] = useState(getDefaultTheme());

  return (
    <StoreProvider store={store}>
      <ThemeProvider theme={currentTheme}>
        <CustomRealmProvider>
          <CurrencyProvider>
            <LockscreenProvider>
              <NavigationLogger />
              <AnimatedSplashScreen setTheme={setCurrentTheme}>
                <Slot />
              </AnimatedSplashScreen>
            </LockscreenProvider>
          </CurrencyProvider>
        </CustomRealmProvider>
      </ThemeProvider>
    </StoreProvider>
  );
}

function AnimatedSplashScreen({
  children,
  setTheme,
}: { setTheme: (theme: ThemeType) => void } & PropsWithChildren) {
  const { width } = useWindowDimensions();
  const { isLockscreenLoading } = useLockscreen();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const largeScreenThreshold = 330;
    setTheme(
      width >= largeScreenThreshold ? getLargeTheme() : getDefaultTheme(),
    );
    setAppIsReady(true);
  }, [width]);

  if (!appIsReady || isLockscreenLoading) {
    SplashScreen.hide();
    return <LottieSplash source={require('@/assets/lottie/splash.json')} />;
  }

  return children;
}
