import { useTheme } from '@/components/ui';
import { useLockscreen } from '@/contexts/useLockscreenContext';
import { Stack } from 'expo-router';
import React from 'react';

export default function Layout() {
  const { isLocked } = useLockscreen();
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.palette.background.primary },
      }}
    >
      <Stack.Screen name="(lockscreen)" />
      <Stack.Screen name="(protected)" redirect={isLocked} />
    </Stack>
  );
}
