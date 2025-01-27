import {
  ThemeProvider as RawThemeProvider,
  useTheme as useStyledTheme,
} from 'styled-components/native';

import { theme, largeTheme, ThemeType } from './theme.styled';

export type { ThemeType } from './theme.styled';

export const getDefaultTheme = () => theme;

export const getLargeTheme = () => largeTheme;

export const useTheme = () => useStyledTheme() as ThemeType;

export const ThemeProvider = RawThemeProvider;
