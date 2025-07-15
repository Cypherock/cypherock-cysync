import { css } from 'styled-components';

export type BgColor =
  | 'contentGradient'
  | 'primary'
  | 'secondary'
  | 'sideBar'
  | 'list'
  | 'black'
  | 'separator'
  | 'separatorSecondary'
  | 'input'
  | 'inputSecondary'
  | 'white'
  | 'highlight'
  | 'golden'
  | 'success'
  | 'muted'
  | 'lightBlack'
  | 'warning'
  | 'dialog'
  | 'popup'
  | 'calendar'
  | 'container'
  | 'slate'
  | 'slateDark'
  | 'headlineLight'
  | 'error'
  | 'infoGreenBg'
  | 'disabled'
  | 'message'
  | 'videoError'
  | 'featureBanner';

export interface BgColorProps {
  $bgColor?: BgColor;
}

const odixListBackgroundColor = '#242424';
const cysyncListBackgroundColor = '#27221D';

export const bgColor = css<BgColorProps>`
  ${props =>
    props.$bgColor === 'contentGradient' &&
    css`
      background-image: ${({ theme }) =>
        (window as any).cysyncEnv?.VENDOR === 'odix'
          ? theme.palette.background.black
          : theme.palette.background.content};
    `}
  ${props =>
    props.$bgColor === 'primary' &&
    css`
      background: ${({ theme }) => theme.palette.background.primary};
    `}
  ${props =>
    props.$bgColor === 'secondary' &&
    css`
      background-image: ${({ theme }) => theme.palette.background.secondary};
    `}
  ${props =>
    props.$bgColor === 'sideBar' &&
    css`
      background-image: ${({ theme }) => theme.palette.background.sideBar};
    `}
  ${props =>
    props.$bgColor === 'input' &&
    css`
      background: ${({ theme }) => theme.palette.background.input};
      /* Assuming border should remain consistent or be handled by border utility */
      /* border: 1px solid ${({ theme }) => theme.palette.border.input}; */
    `}
  ${props =>
    props.$bgColor === 'separator' &&
    css`
      background: ${({ theme }) => theme.palette.background.separator};
    `}
  ${props =>
    props.$bgColor === 'separatorSecondary' &&
    css`
      background: ${({ theme }) => theme.palette.background.separatorSecondary};
    `}
  ${props =>
    props.$bgColor === 'headlineLight' &&
    css`
      background: ${({ theme }) => theme.palette.background.headlineLight};
    `}
  ${props =>
    props.$bgColor === 'slate' &&
    css`
      background: ${({ theme }) => theme.palette.background.slate};
    `}
  ${props =>
    props.$bgColor === 'muted' &&
    css`
      background: ${({ theme }) => theme.palette.text.muted};
    `}
  ${props =>
    props.$bgColor === 'golden' &&
    css`
      /* This 'golden' background should use the vendor-aware gradient for buttons/text */
      background: ${({ theme }) => theme.palette.golden};
    `}
  ${props =>
    props.$bgColor === 'success' &&
    css`
      background: ${({ theme }) => theme.palette.success.main};
    `}
  ${props =>
    props.$bgColor === 'container' &&
    css`
      background: ${({ theme }) => theme.palette.background.container};
    `}
  ${props =>
    props.$bgColor === 'popup' &&
    css`
      /* If 'popup' refers to the dialog background */
      background: ${
        () =>
          typeof window !== 'undefined' &&
          (window as any).cysyncEnv?.VENDOR === 'odix'
            ? '#141414' /* Odix Dialog BG */
            : ({ theme }) =>
                theme.palette.background
                  .primary /* Default Dialog BG, or specific popup BG from theme */
      };
    `}
  ${props =>
    props.$bgColor === 'list' && // MODIFIED: Conditional list background
    css`
      background-color: ${() =>
        typeof window !== 'undefined' &&
        (window as any).cysyncEnv?.VENDOR === 'odix'
          ? odixListBackgroundColor
          : cysyncListBackgroundColor};
    `}
  ${props =>
    props.$bgColor === 'highlight' &&
    css`
      background: ${({ theme }) => theme.palette.highlight};
    `}
  ${props =>
    props.$bgColor === 'lightBlack' &&
    css`
      background: ${({ theme }) => theme.palette.background.lightBlack};
    `}
  ${props =>
    props.$bgColor === 'black' &&
    css`
      background-color: #000000;
    `}
  ${props =>
    props.$bgColor === 'white' &&
    css`
      background-color: #ffffff;
    `}
  ${props =>
    props.$bgColor === 'warning' &&
    css`
      background: ${({ theme }) => theme.palette.background.warning};
    `}
  ${props =>
    props.$bgColor === 'dialog' && // If 'dialog' is used as an alternative to 'primary' or 'popup' for dialogs
    css`
      background: ${
        () =>
          typeof window !== 'undefined' &&
          (window as any).cysyncEnv?.VENDOR === 'odix'
            ? '#141414' /* Odix Dialog BG */
            : ({ theme }) =>
                theme.palette.background.primary /* Default Dialog BG */
      };
    `}
  ${props =>
    props.$bgColor === 'calendar' &&
    css`
      background: ${({ theme }) => theme.palette.background.calendar};
    `}
  ${props =>
    props.$bgColor === 'slateDark' &&
    css`
      background: ${({ theme }) => theme.palette.background.slateDark};
    `}
  ${props =>
    props.$bgColor === 'error' &&
    css`
      background: ${({ theme }) => theme.palette.background.error};
    `}
  ${props =>
    props.$bgColor === 'infoGreenBg' &&
    css`
      background: ${({ theme }) => theme.palette.background.infoGreenBg};
    `}
  ${props =>
    props.$bgColor === 'disabled' &&
    css`
      background: ${({ theme }) => theme.palette.background.disabled};
    `}
  ${props =>
    props.$bgColor === 'message' &&
    css`
      background: ${({ theme }) => theme.palette.background.message};
    `}
  ${props =>
    props.$bgColor === 'videoError' &&
    css`
      background: ${({ theme }) => theme.palette.background.videoError};
    `}
  ${props =>
    props.$bgColor === 'featureBanner' &&
    css`
      background: ${({ theme }) => theme.palette.background.featureBanner};
    `}
`;
