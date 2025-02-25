import { ActivityIndicator } from 'react-native';
import React from 'react';
import { useTheme } from '../themes';

export const Loader = ({ color }: { color?: string }) => {
  const theme = useTheme();
  return <ActivityIndicator color={color ?? theme.palette.accent} />;
};
