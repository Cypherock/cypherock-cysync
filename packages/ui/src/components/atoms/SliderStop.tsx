import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

export interface SliderStopProps {
  Label: string;
  isSelected: boolean;
  isActive: boolean;
}

export const SliderStop: FC<SliderStopProps> = ({
  Label,
  isSelected,
  isActive,
}) => {
  const [isHover, setIsHover] = useState(false);

  const Container = styled.div`
    font-family: Poppins;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
    text-align: center;
    width: 45px;
    height: 66px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  `;

  const StyledContainer = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-top: ${!isActive && (isSelected || isHover) ? '0px' : '8px'};
    border: 8px solid
      ${!isActive && (isSelected || isHover) ? ' #3c3329' : 'inherit'};
    // border-image-source: linear-gradient(90deg, rgba(233, 184, 115, 0.13) 0.19%, rgba(254, 221, 143, 0.13) 37.17%, rgba(183, 141, 81, 0.13) 100.19%)1;
    background: ${isActive || isSelected || isHover
      ? 'linear-gradient(90deg, #E9B873 0.19%, #FEDD8F 37.17%, #B78D51 100.19%)'
      : '#39322C'};
  `;

  const Text = styled.div`
    background: ${isSelected && !isHover
      ? 'linear-gradient(90deg, #E9B873 0.19%, #FEDD8F 37.17%, #B78D51 100.19%)'
      : '#8B8682'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `;

  return (
    <Container
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <StyledContainer />
      <Text>{!isActive && (isHover || isSelected) ? Label : ''}</Text>
    </Container>
  );
};
