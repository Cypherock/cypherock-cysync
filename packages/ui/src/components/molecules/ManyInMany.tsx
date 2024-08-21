import React, { FC } from 'react';
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
import { UtilsProps, WidthProps, utils } from '../utils';

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
  return params.theme.palette.gradients.cardDefault;
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
  width: 340px;
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
  transition: font-weight 0.3s ease-in-out, background 0.3s ease-in-out;

  ${utils}

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
    background-size: contain;
    transition: transform 0.3s ease-in-out;
    transform-origin: bottom center;
  }

  &:hover::after {
    transform: ${({ $isSelected, disabled }) =>
      !disabled && !$isSelected
        ? 'translateX(-40%) translateY(15%) rotate(30deg) scaleY(1.8) scaleX(.8)'
        : 'none'};
    background-position: bottom left;
    background-size: contain;
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
    font-weight: ${({ $isSelected, disabled }) =>
      !$isSelected && !disabled ? '500' : '400'};
  }
`;

const StyledRedInfoImage = styled.div`
  position: absolute;
  right: 8px;
  top: 8px;
`;

export interface ManyInManyProps extends UtilsProps {
  title: string;
  disabled?: boolean;
  isSelected?: boolean;
  onClick: () => void;
}

export const ManyInMany: FC<ManyInManyProps> = ({
  title,
  disabled,
  isSelected,
  onClick,
  ...restProps
}) => {
  const theme = useTheme();

  return (
    <StyledContainer
      onClick={() => !disabled && onClick()}
      $isSelected={Boolean(isSelected)}
      disabled={Boolean(disabled)}
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
        <StyledDateLabel $isSelected={Boolean(isSelected)}>
          {title}
        </StyledDateLabel>
      </Flex>
    </StyledContainer>
  );
};

ManyInMany.defaultProps = {
  isSelected: undefined,
  disabled: undefined,
};
