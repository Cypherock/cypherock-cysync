import { ErrorScreen } from '@/components/core';
import { useTheme } from '@/components/ui';
import { useLockscreen } from '@/contexts/useLockscreenContext';
import logger from '@/utils/logger';
import { ErrorBoundaryProps, Stack } from 'expo-router';
import React, { useEffect } from 'react';

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  useEffect(() => {
    logger.error(error.message, error);
  }, [error]);
  return <ErrorScreen message={error.message} />;
}

export default function Layout() {
  const { isLocked, isPasswordSet } = useLockscreen();
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        navigationBarColor: theme.palette.black,
        headerShown: false,
        contentStyle: { backgroundColor: theme.palette.background.primary },
      }}
    >
      <Stack.Screen name="(lockscreen)" redirect={!isPasswordSet} />
      <Stack.Screen name="(protected)" redirect={isLocked} />
    </Stack>
  );
}
