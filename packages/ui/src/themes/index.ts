import {
  ThemeProvider as RawThemeProvider,
  useTheme as useStyledTheme,
} from 'styled-components';

import { theme, ThemeType } from './theme.styled';

export type { ThemeType } from './theme.styled';

export const getDefaultTheme = () => theme;

export const useTheme = (): ThemeType => {
  const currTheme = useStyledTheme();

  if (!currTheme) {
    throw new Error('No theme set in ThemeProvider');
  }

  return currTheme as any;
};

export const ThemeProvider = RawThemeProvider;
