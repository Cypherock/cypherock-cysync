import React, { FC, useState } from 'react';
import styled from 'styled-components';

import {
  InformationIcon,
  manyInManyBgImage,
  manyInManyHoverBgImage,
  MimDefaultWalletIcon,
  MimHoverWalletIcon,
} from '../../assets';
import { useTheme } from '../../themes';
import { Flex, Typography } from '../atoms';
import { WidthProps, width } from '../utils';

const getBoxShadow = (params: {
  $isSelected: boolean;
  theme: any;
  disabled: boolean;
}) => {
  if (params.disabled) return 'none';
  if (params.$isSelected)
    return `0px 0px 12px 4px ${params.theme.palette.shadow.selected} inset`;
  return `0px 0px 12px 4px ${params.theme.palette.shadow.selected}`;
};

const getBackground = (params: {
  $isSelected: boolean;
  theme: any;
  disabled: boolean;
  isHovered?: boolean;
}) => {
  if (params.$isSelected) return params.theme.palette.background.cardSelected;
  if (params.disabled) return params.theme.palette.background.cardDisabled;
  if (params.isHovered) return params.theme.palette.gradients.cardHover;
  return params.theme.palette.background.cardSelected;
};

const StyledMimDefaultWalletIcon = styled(MimDefaultWalletIcon)``;
const StyledMimHoverWalletIcon = styled(MimHoverWalletIcon)``;

const StyledDateLabel = styled(Typography)<{ $isSelected: boolean }>`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: center;
  z-index: 1;
  margin-top: 16px;
  transition: font-size 0.5s ease;
`;

const StyledContainer = styled.div<
  { $isSelected: boolean; disabled: boolean } & WidthProps
>`
  position: relative;
  overflow: hidden;
  width: 276px;
  height: 128px;
  padding: 24px 16px;
  color: ${({ theme, disabled }) =>
    disabled ? theme.palette.border.separator : theme.palette.bullet.white};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border-radius: 8px;
  border: 1px solid
    ${({ $isSelected, theme, disabled }) =>
      $isSelected && !disabled ? theme.palette.border.selected : 'transparent'};
  box-shadow: ${getBoxShadow};
  background: ${getBackground};
  ${width}

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    background-image: ${({ $isSelected, disabled }) =>
      !disabled && !$isSelected ? `url(${manyInManyBgImage})` : 'none'};
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: 280px;
    transition: transform 0.5s ease-in-out;
    transform-origin: bottom center;
  }

  &:hover::after {
    transform: ${({ $isSelected, disabled }) =>
      !disabled && !$isSelected
        ? 'translateX(-30%) rotate(45deg) scale(1)'
        : 'none'};
    background-position: bottom left 180%;
    width: 167%;
    height: 175%;
    background-size: 496px;
    background-image: ${({ $isSelected, disabled }) =>
      !disabled && !$isSelected ? `url(${manyInManyHoverBgImage})` : 'none'};
  }

  &:hover {
    background: ${({ theme, $isSelected, disabled }) =>
      getBackground({ $isSelected, theme, disabled, isHovered: true })};
  }

  ${StyledMimDefaultWalletIcon} {
    display: block;
  }

  ${StyledMimHoverWalletIcon} {
    display: none;
  }

  &:hover ${StyledMimDefaultWalletIcon} {
    display: ${({ disabled, $isSelected }) =>
      !disabled && !$isSelected ? 'none' : 'block'};
  }

  &:hover ${StyledMimHoverWalletIcon} {
    display: ${({ disabled, $isSelected }) =>
      !disabled && !$isSelected ? 'block' : 'none'};
  }

  &:hover ${StyledDateLabel} {
    font-size: ${({ $isSelected, disabled }) =>
      !$isSelected && !disabled ? '15px' : '14px'};
  }
`;

const StyledRedInfoImage = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
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
  const theme = useTheme();

  return (
    <StyledContainer
      onClick={() => !disabled && setIsSelected(!isSelected)}
      $isSelected={isSelected}
      disabled={disabled}
      {...restProps}
    >
      {disabled && (
        <StyledRedInfoImage>
          <InformationIcon
            fill={theme.palette.background.danger}
            $width={15}
            $height={15}
          />
        </StyledRedInfoImage>
      )}
      <Flex
        align="center"
        direction="column"
        $height="100%"
        justify="center"
        $zIndex={2}
      >
        <StyledMimDefaultWalletIcon
          $zIndex={1}
          stroke={disabled ? theme.palette.background.separator : undefined}
        />
        <StyledMimHoverWalletIcon $zIndex={1} />
        <StyledDateLabel $isSelected={isSelected}>{title}</StyledDateLabel>
      </Flex>
    </StyledContainer>
  );
};