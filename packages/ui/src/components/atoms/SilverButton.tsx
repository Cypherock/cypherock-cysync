import React, { useState } from 'react';
import { styled } from 'styled-components';
import { colors } from '../../themes/color.styled';

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
    isHover ? colors.gradients.silverHover : colors.text.silver};
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
