import React, { FC } from 'react';
import { styled } from 'styled-components';
import { colors } from '../../themes/color.styled';

const StyledContainer = styled.div`
  border-radius: 50%;
  overflow: hidden;
  padding: 3px;
  background: ${colors.gradients.conicGradient.container};
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
  background: ${colors.background.black};
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
