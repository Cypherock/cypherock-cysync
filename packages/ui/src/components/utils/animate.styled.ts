import { css } from 'styled-components';

export interface AnimateProps {
  animate?: 'spin';
  $animDuration?: number;
}

export const animate = css<AnimateProps>`
  ${props => {
    const defaultDuration = 1;
    if (props.animate === 'spin') {
      return ` animation: spinner ${
        props.$animDuration ?? defaultDuration
      }s linear infinite;
  @keyframes spinner {
    100% {
      transform: rotate(360deg);
    }
  }`;
    }
    return '';
  }}
`;
