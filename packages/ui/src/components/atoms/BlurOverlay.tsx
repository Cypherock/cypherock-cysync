import FocusTrap from 'focus-trap-react';
import React, { FC, ReactNode, useRef } from 'react';
import { styled } from 'styled-components';

interface BlurOverlayProps {
  children: ReactNode;
}

const BlurOverlayStyle = styled.div`
  background: rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(3px);
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 64px;
  gap: 10px;
  z-index: 99;

  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
  }
`;

export const BlurOverlay: FC<BlurOverlayProps> = ({ children }) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  return (
    <FocusTrap
      focusTrapOptions={{
        fallbackFocus: () => elementRef.current ?? '',
        escapeDeactivates: false,
        clickOutsideDeactivates: false,
        returnFocusOnDeactivate: true,
      }}
    >
      <BlurOverlayStyle ref={elementRef} tabIndex={-1}>
        {children}
      </BlurOverlayStyle>
    </FocusTrap>
  );
};
