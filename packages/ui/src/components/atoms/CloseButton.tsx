import React, { FC, MouseEventHandler } from 'react';
import { styled } from 'styled-components';
import { closeIcon } from '../../assets';

interface CloseImageProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const CloseImage = styled.img.attrs({
  src: closeIcon,
  alt: 'close',
})``;

const CloseButtonStyle = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: none;
  padding: 4px;
  border: none;
  cursor: pointer;
`;

export const CloseButton: FC<CloseImageProps> = ({ onClick }) => (
  <CloseButtonStyle onClick={onClick}>
    <CloseImage />
  </CloseButtonStyle>
);
