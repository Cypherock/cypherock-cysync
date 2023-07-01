import React from 'react';
import { styled } from 'styled-components';

interface ThrobberProps {
  size: number;
  strokeWidth: number;
}

interface ThrobberStyleProps {
  size: number;
}

const ThrobberWrapperStyle = styled.svg<ThrobberStyleProps>`
  animation: rotate 2s linear infinite;
  overflow: visible;
  height: ${props => props.size}px;
  width: ${props => props.size}px;
  position: relative;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ThrobberRingStyle = styled.circle<ThrobberStyleProps>`
  stroke-dasharray: 1, 880;
  stroke-dashoffset: 0;
  animation: dash 1.5s ease-in-out infinite;
  stroke-linecap: round;

  @keyframes dash {
    0% {
      stroke-dasharray: 1, ${({ size }) => size * 5};
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: ${({ size }) => size * 2.25}, ${({ size }) => size * 5};
      stroke-dashoffset: ${({ size }) => size * -0.8};
    }
    100% {
      stroke-dasharray: ${({ size }) => size * 2.25}, ${({ size }) => size * 5};
      stroke-dashoffset: ${({ size }) => size * -3.3};
    }
  }
`;

export const Throbber: React.FC<ThrobberProps> = ({ size, strokeWidth }) => {
  const radius = size / 2;

  return (
    <ThrobberWrapperStyle size={size}>
      <ThrobberRingStyle
        size={size}
        cx={radius}
        cy={radius}
        r={radius}
        fill="none"
        stroke="url(#paint0_linear_1_516)"
        strokeWidth={strokeWidth}
        strokeMiterlimit="10"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_516"
          x1={0}
          y1={radius}
          x2={size}
          y2={radius}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E9B873" />
          <stop offset="0.5" stopColor="#FEDD8F" />
          <stop offset="1" stopColor="#B78D51" />
        </linearGradient>
      </defs>
    </ThrobberWrapperStyle>
  );
};
