import { css } from 'styled-components';

type animationType = 'spin' | 'pulse' | 'skeleton';
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
          scale: 1;
          opacity: 0.9;
        }
        100% {
          scale: 1.6;
          opacity: 0;
        }
      }`;
    }

    if (props.animate === 'skeleton') {
      return ` animation: skeleton 1s linear infinite alternate;

      animation-delay: ${props.$animDelay ?? defaultDelay}s ;

      @keyframes skeleton {
        0% {
          background-color: rgba(43, 41, 39, 0.4);
        }
        100% {
          background-color: rgba(53, 51, 49, 0.7);
        }
      }`;
    }

    return '';
  }}
`;
