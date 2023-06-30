import {
  ThemeProvider as RawThemeProvider,
  useTheme as useStyledTheme,
} from 'styled-components';

import { theme } from './theme.styled';

export const getDefaultTheme = () => theme;

export const useTheme = () => {
  const currTheme = useStyledTheme();

  if (!currTheme) {
    throw new Error('No theme set in ThemeProvider');
  }

  return currTheme;
};
export const ThemeProvider = RawThemeProvider;
