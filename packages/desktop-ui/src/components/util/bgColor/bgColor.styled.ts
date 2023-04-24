import { css } from 'styled-components';

export interface BgColorProps {
  bgColor?: 'contentGratient' | 'sideBar' | 'list' | 'black' | 'white';
}

export const bgColor = css<BgColorProps>`
  ${props =>
    props.bgColor === 'contentGratient' &&
    css`
      background-image: ${({ theme }) =>
        theme.palette.background.contentBackground};
    `}

  ${props =>
    props.bgColor === 'sideBar' &&
    css`
      background-image: ${({ theme }) =>
        theme.palette.background.sideBarBackground};
    `}

${props =>
    props.bgColor === 'list' &&
    css`
      background-color: #27221d;
    `}


${props =>
    props.bgColor === 'black' &&
    css`
      background-color: #000;
    `}
  ${props =>
    props.bgColor === 'white' &&
    css`
      background-color: #fff;
    `}
`;
