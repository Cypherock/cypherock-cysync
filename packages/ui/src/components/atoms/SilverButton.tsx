import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

export const SilverButton: FC = () => {
  const [isHover, setIsHover] = useState(false);

  const StyledContainer = styled.div`
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 252px;
    height: 48px;
    border-radius: 8px;
    background: ${isHover
      ? 'linear-gradient(180deg, #A2ADB3 0%, #F3F1F2 36%, #BCC3C9 91.5%, #DCDFE4 100%)'
      : 'linear-gradient(90deg, #A2ADB3 1.67%, #F3F1F2 35.99%, #BCC3C9 66.2%, #DCDFE4 100%)'};
    font-family: Poppins;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
  `;
  return (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      Select
    </StyledContainer>
  );
};
