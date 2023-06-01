import { ThemeProvider as RawThemeProvider } from 'styled-components';
import { theme } from './theme.styled';

export const getDefaultTheme = () => theme;
export * from './theme.styled';

export const ThemeProvider = RawThemeProvider;
