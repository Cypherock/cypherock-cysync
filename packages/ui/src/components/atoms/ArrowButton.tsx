import React, { FC, MouseEventHandler } from 'react';
import { styled } from 'styled-components';
import { arrow } from '../../assets';

interface ArrowButtonProps {
  direction: 'left' | 'right';
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
  ${({ direction }) => direction === 'right' && `rotate: 180deg;`}
`;

const ArrowImage = styled.img.attrs({
  src: arrow,
  alt: 'arrow',
})``;

export const ArrowButton: FC<ArrowButtonProps> = ({
  direction,
  onClick,
  ...props
}) => (
  <ArrowButtonStyle direction={direction} onClick={onClick} {...props}>
    <ArrowImage />
  </ArrowButtonStyle>
);
