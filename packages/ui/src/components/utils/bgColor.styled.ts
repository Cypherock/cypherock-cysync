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
  | 'warning'
  | 'calendar'
  | 'container'
  | 'error';
export interface BgColorProps {
  $bgColor?: BgColor;
}

export const bgColor = css<BgColorProps>`
  ${props =>
    props.$bgColor === 'contentGradient' &&
    css`
      background-image: ${({ theme }) => theme.palette.background.content};
    `}
  ${props =>
    props.$bgColor === 'primary' &&
    css`
      background-image: ${({ theme }) => theme.palette.background.primary};
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
      border: 1px solid ${({ theme }) => theme.palette.border.input};
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
    props.$bgColor === 'muted' &&
    css`
      background: ${({ theme }) => theme.palette.text.muted};
    `}
  ${props =>
    props.$bgColor === 'golden' &&
    css`
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
      background: ${({ theme }) => theme.palette.background.popup};
    `}

${props =>
    props.$bgColor === 'list' &&
    css`
      background-color: #27221d;
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
      background-color: #000;
    `}
  ${props =>
    props.$bgColor === 'white' &&
    css`
      background-color: #fff;
    `}
  ${props =>
    props.$bgColor === 'warning' &&
    css`
      background: ${({ theme }) => theme.palette.background.warning};
    `}
    ${props =>
    props.$bgColor === 'dialog' &&
    css`
      background: ${({ theme }) => theme.palette.text.dialog};
    `}
    ${props =>
    props.$bgColor === 'calendar' &&
    css`
      background: ${({ theme }) => theme.palette.background.calendar};
    `}
    ${props =>
    props.$bgColor === 'error' &&
    css`
      background: ${({ theme }) => theme.palette.background.error};
    `}
`;
