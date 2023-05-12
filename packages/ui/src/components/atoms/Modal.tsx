import React, { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { UtilsProps, utils } from '../utils';

interface ModalProps extends UtilsProps {
  children?: ReactNode;
  borderRadiusOne?: boolean;
  border?: boolean;
  scroll?: boolean;
  roundedListTop?: boolean;
  roundedListBottom?: boolean;
  shadow?: boolean;
  size?: 'lg';
}

const ModalStyle = styled.div<ModalProps>`
  ${utils}

  ${props =>
    props.position &&
    css`
      position: ${props.position};
    `}
  height: 100vh;
  width: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3); /* Semi-transparent black */
  backdrop-filter: blur(3px);
`;

export const Modal: FC<ModalProps> = ({ children, ...props }) => (
  <ModalStyle {...props}>{children}</ModalStyle>
);

Modal.defaultProps = {
  children: null,
  borderRadiusOne: false,
  border: false,
  scroll: false,
  roundedListTop: false,
  roundedListBottom: false,
  shadow: false,
  size: 'lg',
};
