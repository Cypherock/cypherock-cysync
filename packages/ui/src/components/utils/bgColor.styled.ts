import { css } from 'styled-components';

export interface BgColorProps {
  $bgColor?:
    | 'contentGradient'
    | 'primary'
    | 'secondary'
    | 'sideBar'
    | 'list'
    | 'black'
    | 'separator'
    | 'separatorSecondary'
    | 'input'
    | 'white'
    | 'highlight'
    | 'golden'
    | 'muted';
}

export const $bgColor = css<BgColorProps>`
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
    props.$bgColor === 'black' &&
    css`
      background-color: #000;
    `}
  ${props =>
    props.$bgColor === 'white' &&
    css`
      background-color: #fff;
    `}
`;
