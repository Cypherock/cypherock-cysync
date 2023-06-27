import 'styled-components';
import { ThemeType } from './themes/theme.styled';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
