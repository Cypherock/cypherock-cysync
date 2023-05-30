import React, { FC, ReactNode } from 'react';
import { styled } from 'styled-components';

interface BlurOverlayProps {
  children: ReactNode;
}

const BlurOverlayStyle = styled.div`
  background: rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(3px);
  position: absolute;
  width: 100%;
  height: 100vh;
  left: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 64px;
  gap: 10px;
`;

export const BlurOverlay: FC<BlurOverlayProps> = ({ children }) => (
  <BlurOverlayStyle>{children}</BlurOverlayStyle>
);
