import 'styled-components/native';
import { ThemeType } from './themes/theme.styled';

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends ThemeType {}
}
