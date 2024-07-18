import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '../atoms';
import {
  InfoItalicsIcon,
  manyInManyBackground,
  manyIManyDefault,
  MimDefaultWallet,
  MimHoverWalletIcon,
} from '../../assets';
import { WidthProps, width } from '../utils';

const getBoxShadow = ($isSelected: boolean, theme: any, disabled: boolean) => {
  if (disabled) return 'none';
  if ($isSelected)
    return `0px 0px 12px 4px ${theme.palette.shadow.selected} inset`;
  return `0px 0px 12px 4px ${theme.palette.shadow.selected}`;
};

const getBackground = ($isSelected: boolean, theme: any, disabled: boolean) => {
  if (disabled) return theme.palette.background.disabledBackground;
  if ($isSelected) return theme.palette.text.selected;
  return theme.palette.selected.default;
};

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
  border: ${({ $isSelected, theme, disabled }) =>
    $isSelected && !disabled
      ? `1px solid ${theme.palette.border.selected}`
      : 'none'};
  box-shadow: ${({ $isSelected, theme, disabled }) =>
    getBoxShadow($isSelected, theme, disabled)};
  background: ${({ $isSelected, theme, disabled }) =>
    getBackground($isSelected, theme, disabled)};
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
      !disabled && !$isSelected ? `url(${manyIManyDefault})` : 'none'};
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: 280px;
    transition: transform 0.8s ease-in-out;
    transform-origin: bottom center;
  }

  &:hover::after {
    transform: ${({ $isSelected, disabled }) =>
      !disabled && !$isSelected
        ? 'translateX(-30%) rotate(45deg) scale(1.5)'
        : 'none'};
    background-position: bottom left 180%;
    width: 167%;
    height: 175%;
    background-size: 496px;
    background-image: ${({ $isSelected, disabled }) =>
      !disabled && !$isSelected ? `url(${manyInManyBackground})` : 'none'};
  }

  &:hover {
    background: ${({ $isSelected, theme, disabled }) =>
      getBackground($isSelected, theme, disabled)};
  }

  .default-wallet {
    display: block;
  }

  .hover-wallet {
    display: none;
  }

  &:hover .default-wallet {
    display: ${({ disabled, $isSelected }) =>
      !disabled && !$isSelected ? 'none' : 'block'};
  }

  &:hover .hover-wallet {
    display: ${({ disabled, $isSelected }) =>
      !disabled && !$isSelected ? 'block' : 'none'};
  }

  &:hover .date-label {
    font-size: ${({ $isSelected }) => (!$isSelected ? '15px' : '14px')};
  }
`;

const StyledRedInfoImage = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;
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

  return (
    <StyledContainer
      onClick={() => !disabled && setIsSelected(!isSelected)}
      $isSelected={isSelected}
      disabled={disabled}
      {...restProps}
    >
      {!disabled ? (
        <Flex
          align="center"
          direction="column"
          $height="100%"
          justify="center"
          $zIndex={2}
        >
          <div className="default-wallet">
            <MimDefaultWallet $zIndex={1} />
          </div>
          <div className="hover-wallet">
            <MimHoverWalletIcon $zIndex={1} />
          </div>
          <StyledDateLabel className="date-label" $isSelected={isSelected}>
            {title}
          </StyledDateLabel>
        </Flex>
      ) : (
        <>
          <StyledRedInfoImage>
            <InfoItalicsIcon fill="#FF624C" />
          </StyledRedInfoImage>
          <Flex
            align="center"
            direction="column"
            $height="100%"
            justify="center"
          >
            <div>
              <MimDefaultWallet $zIndex={1} stroke="#39322C" />
            </div>
            {title}
          </Flex>
        </>
      )}
    </StyledContainer>
  );
};
