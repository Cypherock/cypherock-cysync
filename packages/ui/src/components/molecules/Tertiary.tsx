import React, { useState } from 'react';
import { styled } from 'styled-components';
import { Addition } from '../../assets';
import { colors } from '../../themes/color.styled';

interface TertiaryProps {
  textLabel: string;
}

export const Tertiary = ({ textLabel }: TertiaryProps) => {
  const [isHover, setIsHover] = useState(false);
  const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 6px;
    overflow: hidden;
    width: 185px;
    height: 37px;
    color: ${colors.text.muted};
    background: ${isHover
      ? colors.background.separatorTertiary
      : colors.background.separatorSecondary};
  `;

  const TextLabel = styled.p`
        font-family: Poppins;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        text-align: center;
        background: ${isHover ? colors.text.gold : ';'}
        -webkit-background-clip: ${isHover ? 'text' : 'inherit'};
        -webkit-text-fill-color: ${isHover ? 'transparent' : 'inherit'}
    `;

  return (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Addition />
      <TextLabel>{textLabel}</TextLabel>
    </StyledContainer>
  );
};
