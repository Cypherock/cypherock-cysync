import { useTheme } from '@/components/ui';
import { useLockscreen } from '@/contexts/useLockscreenContext';
import { SplashScreen, Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  const { isLocked, isLockscreenLoading, isPasswordSet } = useLockscreen();
  const theme = useTheme();

  if (isLockscreenLoading) {
    return null;
  } else {
    SplashScreen.hide();
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.palette.background.primary },
      }}
    >
      <Stack.Screen name="(lockscreen)" redirect={!isPasswordSet} />
      <Stack.Screen name="(protected)" redirect={isLocked} />
    </Stack>
  );
}
