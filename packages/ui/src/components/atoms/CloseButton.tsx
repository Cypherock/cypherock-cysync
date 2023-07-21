import React, { FC, MouseEventHandler } from 'react';
import { styled } from 'styled-components';

import { closeIcon } from '../../assets';
import { UtilsProps, utils } from '../utils';

interface CloseImageProps extends UtilsProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const CloseImage = styled.img.attrs({
  src: closeIcon,
  alt: 'close',
})``;

const CloseButtonStyle = styled.button<CloseImageProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: none;
  padding: 4px;
  border: none;
  cursor: pointer;
  ${utils}
`;

export const CloseButton: FC<CloseImageProps> = ({ onClick, ...props }) => (
  <CloseButtonStyle onClick={onClick} {...props}>
    <CloseImage />
  </CloseButtonStyle>
);
