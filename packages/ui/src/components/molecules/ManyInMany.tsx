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
import { WidthProps, width } from '../utils';
import { theme } from '../../themes/theme.styled';

const StyledDisableContainer = styled.div<WidthProps>`
  position: relative;
  background: ${theme.palette.background.disabledBackground};
  overflow: hidden;
  border-radius: 8px;
  width: 276px;
  height: 128px;
  padding: 24px 16px;
  color: ${theme.palette.border.separatorSecondary};
  cursor: not-allowed;
  ${width}
`;

const WalletDefaultImage = styled.img.attrs({
  src: mimDefaultWallet,
  alt: 'wallet',
})`
  z-index: 1;
`;

const WalletHoverImage = styled.img.attrs({
  src: mimHovertWallet,
  alt: 'wallet hover',
})`
  z-index: 1;
`;

const WalletDisableImage = styled.img.attrs({
  src: mimDisableWallet,
  alt: 'wallet hover',
})`
  margin-bottom: 16px;
`;

const StyledRedInfoImage = styled.img.attrs({
  src: redInfo,
  alt: 'Info',
})`
  position: absolute;
  right: 10px;
  top: 10px;
`;

export interface ManyInManyProps extends WidthProps {
  title: string;
  disabled: boolean;
}

const StyledContainer = styled.div<{ isSelected: boolean } & WidthProps>`
  position: relative;
  overflow: hidden;
  width: 276px;
  height: 128px;
  padding: 24px 16px;
  color: ${theme.palette.bullet.white};
  cursor: pointer;
  border-radius: 8px;
  border: ${({ isSelected }) =>
    isSelected ? `1px solid ${theme.palette.border.selected}` : 'none'};
  box-shadow: ${({ isSelected }) =>
    !isSelected
      ? `0px 0px 12px 4px ${theme.palette.shadow.selected}`
      : `0px 0px 12px 4px ${theme.palette.shadow.selected} inset`};
  background: ${({ isSelected }) =>
    !isSelected ? theme.palette.selected.default : theme.palette.text.selected};

  ${width}

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
    background-size: 280px;
    transition: transform 0.8s ease-in-out;
    transform-origin: bottom center;
  }
  &:hover::after {
    transform: ${({ isSelected }) =>
      !isSelected ? 'translateX(-30%) rotate(45deg) scale(1.5)' : 'none'};
    background-position: bottom left 180%;
    width: 167%;
    height: 175%;
    background-size: 496px;
    background-image: url(${({ isSelected }) =>
      !isSelected ? mimDefaultBg : 'none'});
  }
  &:hover {
    background: ${({ isSelected }) =>
      !isSelected ? theme.palette.selected.hover : theme.palette.text.selected};
  }
  position: relative;
  z-index: 1;
`;
const StyledDateLabel = styled.div<{ isSelected: boolean }>`
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: center;
  z-index: 1;
  margin-top: 16px;
  transition: font-size 1s ease;

  ${StyledContainer}:hover & {
    font-size: ${({ isSelected }) => (!isSelected ? '15px' : '14px')};
  }
`;

export const ManyInMany: FC<ManyInManyProps> = ({
  title,
  disabled,
  ...restProps
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  return !disabled ? (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsSelected(!isSelected)}
      onMouseLeave={() => setIsHover(false)}
      isSelected={isSelected}
      {...restProps}
    >
      <Flex
        align="center"
        direction="column"
        $height="100%"
        justify="center"
        $zIndex={2}
      >
        {isHover && !isSelected ? <WalletHoverImage /> : <WalletDefaultImage />}
        <StyledDateLabel isSelected={isSelected}>{title}</StyledDateLabel>
      </Flex>
    </StyledContainer>
  ) : (
    <StyledDisableContainer>
      <StyledRedInfoImage />
      <Flex align="center" direction="column" $height="100%" justify="center">
        <WalletDisableImage />
        {title}
      </Flex>
    </StyledDisableContainer>
  );
};
