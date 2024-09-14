import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface InputContainerProps {
  children: ReactNode;
}

const InputContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  position: relative;
  img {
    position: absolute;
    right: 24px;
    bottom: 32px;
  }
`;

export const InputContainer: FC<InputContainerProps> = ({ children }) => (
  <InputContainerStyle>{children}</InputContainerStyle>
);
