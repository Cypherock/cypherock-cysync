import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '../atoms';
import {
  MimDefaultWallet,
  InfoItalicsIcon,
  manyInManyBackground,
  manyIManyDefault,
} from '../../assets';
import { WidthProps, width } from '../utils';
import { svgGradients } from '../GlobalStyles';

const StyledDisableContainer = styled.div<WidthProps>`
  position: relative;
  background: ${({ theme }) => theme.palette.background.disabledBackground};
  overflow: hidden;
  border-radius: 8px;
  width: 276px;
  height: 128px;
  padding: 24px 16px;
  color: ${({ theme }) => theme.palette.border.separator};
  cursor: not-allowed;
  ${width}
`;

const WalletDisableImage = styled.div`
  margin-bottom: 16px;
`;

const StyledRedInfoImage = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const StyledContainer = styled.div<{ $isSelected: boolean } & WidthProps>`
  position: relative;
  overflow: hidden;
  width: 276px;
  height: 128px;
  padding: 24px 16px;
  color: ${({ theme }) => theme.palette.bullet.white};
  cursor: pointer;
  border-radius: 8px;
  border: ${({ $isSelected, theme }) =>
    $isSelected ? `1px solid ${theme.palette.border.selected}` : 'none'};
  box-shadow: ${({ $isSelected, theme }) =>
    !$isSelected
      ? `0px 0px 12px 4px ${theme.palette.shadow.selected}`
      : `0px 0px 12px 4px ${theme.palette.shadow.selected} inset`};
  background: ${({ $isSelected, theme }) =>
    !$isSelected
      ? theme.palette.selected.default
      : theme.palette.text.selected};

  ${width}

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    background-image: ${({ $isSelected }) =>
      !$isSelected ? `url(${manyIManyDefault})` : 'none'};
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: 280px;
    transition: transform 0.8s ease-in-out;
    transform-origin: bottom center;
  }
  &:hover::after {
    transform: ${({ $isSelected }) =>
      !$isSelected ? 'translateX(-30%) rotate(45deg) scale(1.5)' : 'none'};
    background-position: bottom left 180%;
    width: 167%;
    height: 175%;
    background-size: 496px;
    background-image: ${({ $isSelected }) =>
      !$isSelected ? `url(${manyInManyBackground})` : 'none'};
  }
  &:hover {
    background: ${({ $isSelected, theme }) =>
      !$isSelected
        ? theme.palette.selected.hover
        : theme.palette.text.selected};
  }
  position: relative;
  z-index: 1;

  &:hover .wallet-icon {
    stroke: ${({ $isSelected }) =>
      !$isSelected ? `url(#${svgGradients.gold})` : 'none'};
  }

  &:hover .date-label {
    font-size: ${({ $isSelected }) => (!$isSelected ? '15px' : '14px')};
  }
`;

const StyledDateLabel = styled.div<{ $isSelected: boolean }>`
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: center;
  z-index: 1;
  margin-top: 16px;
  transition: font-size 1s ease;
`;

export interface ManyInManyProps extends WidthProps {
  title: string;
  disabled: boolean;
}

export const ManyInMany: FC<ManyInManyProps> = ({
  title,
  disabled,
  ...restProps
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isHover, setIsHover] = useState(false);

  return !disabled ? (
    <StyledContainer
      onClick={() => setIsSelected(!isSelected)}
      $isSelected={isSelected}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      {...restProps}
    >
      <Flex
        align="center"
        direction="column"
        $height="100%"
        justify="center"
        $zIndex={2}
      >
        {isHover && !isSelected ? (
          <MimDefaultWallet $zIndex={1} stroke={`url(#${svgGradients.gold})`} />
        ) : (
          <MimDefaultWallet $zIndex={1} />
        )}
        <StyledDateLabel className="date-label" $isSelected={isSelected}>
          {title}
        </StyledDateLabel>
      </Flex>
    </StyledContainer>
  ) : (
    <StyledDisableContainer>
      <StyledRedInfoImage>
        <InfoItalicsIcon fill="#FF624C" />
      </StyledRedInfoImage>
      <Flex align="center" direction="column" $height="100%" justify="center">
        <WalletDisableImage>
          <MimDefaultWallet $zIndex={1} stroke="#39322C" />
        </WalletDisableImage>
        {title}
      </Flex>
    </StyledDisableContainer>
  );
};
