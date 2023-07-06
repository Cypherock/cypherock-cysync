import 'styled-components';
import { ThemeType } from './themes/theme.styled';

declare module 'styled-components' {
  export type DefaultTheme = ThemeType;
}
