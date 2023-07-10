import React, { FC, MouseEventHandler } from 'react';
import { styled } from 'styled-components';

import { arrowBlackBackward, arrowWhiteBackward } from '../../assets';

interface ArrowButtonProps {
  direction: 'left' | 'right';
  variant?: 'disabled' | 'enabled';
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const ArrowButtonStyle = styled.button<ArrowButtonProps>`
  display: flex;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 99999px;
  background: ${({ theme }) => theme.palette.golden};
  border: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.4s ease-out;
  &:hover {
    background: linear-gradient(
      180deg,
      #e9b873 0.19%,
      #fedd8f 37.17%,
      #b78d51 100.19%
    );
  }
  &:disabled {
    cursor: not-allowed;
    background: ${({ theme }) => theme.palette.background.separator};
    border: 1px solid ${({ theme }) => theme.palette.border.input};
  }
  ${({ direction }) => direction === 'right' && `rotate: 180deg;`}
`;

const BlackArrowImage = styled.img.attrs({
  src: arrowBlackBackward,
  alt: 'arrowBlackBackward',
})``;
const WhiteArrowImage = styled.img.attrs({
  src: arrowWhiteBackward,
  alt: 'arrowWhiteBackward',
})``;

export const ArrowButton: FC<ArrowButtonProps> = ({
  direction,
  variant,
  onClick,
  ...props
}) => (
  <ArrowButtonStyle
    disabled={variant === 'disabled'}
    direction={direction}
    onClick={onClick}
    {...props}
  >
    {variant === 'enabled' ? <BlackArrowImage /> : <WhiteArrowImage />}
  </ArrowButtonStyle>
);

ArrowButton.defaultProps = {
  variant: 'enabled',
};
