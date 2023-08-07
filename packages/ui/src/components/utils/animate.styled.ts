import { css } from 'styled-components';

type animationType = 'spin' | 'pulse';
export interface AnimateProps {
  animate?: animationType;
  $animDuration?: number;
  $animDelay?: number;
}

export const animate = css<AnimateProps>`
  ${props => {
    const defaultDuration = 1;
    const defaultDelay = 0;
    if (props.animate === 'spin') {
      return ` animation: spinner ${
        props.$animDuration ?? defaultDuration
      }s linear infinite;
  @keyframes spinner {
    100% {
      rotate: 360deg;
    }
  }`;
    }
    if (props.animate === 'pulse') {
      return ` animation: pulse ${
        props.$animDuration ?? defaultDuration
      }s ease-in-out infinite;
      animation-delay: ${props.$animDelay ?? defaultDelay}s ;
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.9;
    }
    100% {
      transform: scale(1.6);
      opacity: 0;
    }
  }`;
    }
    return '';
  }}
`;
