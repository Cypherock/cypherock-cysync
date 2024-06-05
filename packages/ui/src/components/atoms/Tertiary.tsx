import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import { plus, minus } from '../../assets';

const Plus = styled.img.attrs({
  src: plus,
  alt: 'plus',
})``;

const Minus = styled.img.attrs({
  src: minus,
  alt: 'minus',
})``;

export const Tertiary: FC = () => {
  const [isHover, setIsHover] = useState(false);
  const StyledContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 6px;
    overflow: hidden;
    width: 185px;
    height: 37px;
    color: #8b8682;
    background: ${isHover ? '#2e2c2b' : '#272320'};
  `;

  const TextLabel = styled.p`
        font-family: Poppins;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
        text-align: center;
        background: ${
          isHover
            ? 'linear-gradient(90deg, #E9B873 0.19%, #FEDD8F 37.17%, #B78D51 100.19%);'
            : ';'
        }
        -webkit-background-clip: ${isHover ? 'text' : 'inherit'};
        -webkit-text-fill-color: ${isHover ? 'transparent' : 'inherit'}
    `;

  return (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Plus />
      <Minus />
      <TextLabel>Add second email</TextLabel>
    </StyledContainer>
  );
};
