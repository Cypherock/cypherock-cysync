import React, { FC, useState } from 'react';
import { styled } from 'styled-components';
import { Flex } from '../atoms/Flex';

import {
  mimDefault,
  mimDefaultBg,
  mimDefaultWallet,
  mimDisableWallet,
  mimHovertWallet,
  redInfo,
} from '../../assets';
import { colors } from '../../themes/color.styled';

const StyledDisableContainer = styled.div`
  position: relative;
  background: ${colors.background.disabled};
  overflow: hidden;
  border-radius: 8px;
  width: 276px;
  height: 128px;
  padding: 24px 16px;
  color: ${colors.border.separator};
`;

const StyledDateLabel = styled.div`
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: center;
  z-index: 1;
`;

const WalletDefaultImage = styled.img.attrs({
  src: mimDefaultWallet,
  alt: 'wallet',
})`
  zindex: 1;
`;

const WalletHoverImage = styled.img.attrs({
  src: mimHovertWallet,
  alt: 'wallet hover',
})`
  zindex: 1;
`;

const WalletDisableImage = styled.img.attrs({
  src: mimDisableWallet,
  alt: 'wallet hover',
})``;

const StyledRedInfoImage = styled.img.attrs({
  src: redInfo,
  alt: 'Info',
})`
  position: absolute;
  right: 10px;
  top: 10px;
`;

export interface ManyInManyProps {
  title: string;
  disabled: boolean;
}

const StyledContainer = styled.div<{ isSelected: boolean }>`
  position: relative;
  overflow: hidden;
  width: 276px;
  height: 128px;
  padding: 24px 16px;
  color: ${colors.text.white};
  cursor: pointer;
  border-radius: 8px;
  border: ${({ isSelected }) =>
    isSelected ? `1px solid ${colors.border.selected}` : 'none'};
  box-shadow: ${({ isSelected }) =>
    !isSelected
      ? `0px 0px 12px 4px ${colors.boxShadow.selected}`
      : `0px 0px 12px 4px ${colors.boxShadow.selected} inset`};
  background: ${({ isSelected }) =>
    !isSelected ? colors.gradients.selected.default : colors.selected.default};
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    background-image: url(${({ isSelected }) =>
      !isSelected ? mimDefault : 'none'});
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: 450px;
    transition: transform 0.4s ease-in-out;
    transform-origin: bottom center;
  }
  &:hover::after {
    transform: ${({ isSelected }) =>
      !isSelected ? 'translateX(-30%) rotate(45deg) scale(1.5)' : 'none'};
    background-position: bottom left;
    background-image: url(${({ isSelected }) =>
      !isSelected ? mimDefaultBg : 'none'});
  }
  &:hover {
    background: ${({ isSelected }) =>
      !isSelected
        ? colors.gradients.selected.hover
        : colors.gradients.selected.default};
    box-shadow: 0px 4px 12px 4px ${colors.boxShadow.selected};
  }
  position: relative;
  z-index: 1;
`;

export const ManyInMany: FC<ManyInManyProps> = ({ title, disabled }) => {
  const [isHover, setIsHover] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  return !disabled ? (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsSelected(!isSelected)}
      onMouseLeave={() => setIsHover(false)}
      className="oneInManyContainer"
      isSelected={isSelected}
    >
      <Flex
        align="center"
        direction="column"
        $height="100%"
        justify="center"
        pl="24px"
        $zIndex={2}
      >
        {isHover ? <WalletHoverImage /> : <WalletDefaultImage />}
        <StyledDateLabel>{title}</StyledDateLabel>
      </Flex>
    </StyledContainer>
  ) : (
    <StyledDisableContainer>
      <StyledRedInfoImage />
      <Flex
        align="center"
        direction="column"
        $height="100%"
        justify="center"
        pl="24px"
      >
        <WalletDisableImage />
        <div>{title}</div>
      </Flex>
    </StyledDisableContainer>
  );
};
