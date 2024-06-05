import React, { FC } from 'react';
import { styled } from 'styled-components';

const StyledContainer = styled.div`
  border-radius: 50%;
  overflow: hidden;
  padding: 3px;
  background: conic-gradient(
    from -0.2deg at 50.19% 50%,
    #e9b873 0deg,
    rgba(233, 184, 115, 0.3) 360deg
  );
  animation: spin 1s infinite linear;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
`;

const InnerCircle = styled.div`
  background: black;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  opacity: 1;
`;

export const LoadingCircle: FC = () => (
  <StyledContainer>
    <InnerCircle />
  </StyledContainer>
);
