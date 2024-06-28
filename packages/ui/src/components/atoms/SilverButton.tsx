import React, { useState } from 'react';
import { styled } from 'styled-components';

export interface SilverButtonProps {
  title: string;
}

const StyledContainer = styled.div<{ isHover: boolean }>`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 352px;
  height: 48px;
  border-radius: 8px;
  background: ${({ isHover }) =>
    isHover
      ? 'linear-gradient(180deg, #A2ADB3 0%, #F3F1F2 36%, #BCC3C9 91.5%, #DCDFE4 100%)'
      : 'linear-gradient(90deg, #A2ADB3 1.67%, #F3F1F2 35.99%, #BCC3C9 66.2%, #DCDFE4 100%)'};
  font-family: Poppins;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
`;

export const SilverButton = ({ title }: SilverButtonProps) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      isHover={isHover}
    >
      {title}
    </StyledContainer>
  );
};
