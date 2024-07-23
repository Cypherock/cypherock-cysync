import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { ClockIcon, InformationIcon, bgClockIcon } from '../../assets';
import { useTheme } from '../../themes';
import { Typography, Flex } from '../atoms';
import { svgGradients } from '../GlobalStyles';
import { WidthProps, width } from '../utils';

const StyledContainer = styled.div<
  WidthProps & { $isSelected: boolean; $isHover: boolean }
>`
  position: relative;
  background: ${props =>
    !props.$isSelected
      ? `linear-gradient(273deg, rgba(96, 58, 23, 0.20) 1.52%, rgba(0, 0, 0, 0.00) 52.42%), #2A2A27`
      : props.theme.palette.background.cardSelected};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  width: 348px;
  height: 53px;
  color: ${({ theme }) => theme.palette.bullet.white};
  z-index: 1;
  box-shadow: ${props =>
    props.$isSelected
      ? `0px 0px 12px 4px ${props.theme.palette.shadow.selected} inset`
      : `0px 0px 12px 4px ${props.theme.palette.shadow.selected}`};
  border: 1px solid
    ${props =>
      props.$isSelected
        ? `${props.theme.palette.border.selected}`
        : 'transparent'};

  ${width}

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${props =>
        props.$isSelected
          ? ''
          : `url(${bgClockIcon}), url(${bgClockIcon}), url(${bgClockIcon})`},
      url(${bgClockIcon}), url(${bgClockIcon}), url(${bgClockIcon});
    background-size: 40px 40px;
    background-repeat: no-repeat;
    background-position: -20px -15px, 30px 30px, 80px -30px, 140px 30px, 200px 0,
      270px 30px;
    z-index: -1;
    animation: ${props =>
      !props.$isSelected && props.$isHover
        ? 'moveBackgrounds 1s ease-in-out forwards'
        : ''};
  }

  &:hover {
    border-radius: var(--8-px, 8px);
    background: ${props =>
      props.$isSelected
        ? ''
        : `linear-gradient(93deg, rgba(96, 58, 23, 0.20) 0%, rgba(0, 0, 0, 0.00) 52.46%), #332F2D`};
    &:before {
      animation: moveBackgrounds 1s ease-in-out forwards;
    }
  }

  &:not(:hover):before {
    animation: moveBackgroundsBack 1s ease-in-out forwards;
  }

  @keyframes moveBackgrounds {
    0% {
      background-position-y: -15px, 30px, -30px, 30px, 0, 30px;
      background-position-x: -20px, 30px, 80px, 140px, 200px, 270px;
    }
    100% {
      background-position-y: 30px, -30px, 30px, -15px, 30px, -30px;
      background-position-x: -20px, 50px, 110px, 160px, 230px, 290px;
    }
  }

  @keyframes moveBackgroundsBack {
    0% {
      background-position-y: 30px, -30px, 30px, -15px, 30px, -30px;
      background-position-x: -20px, 50px, 110px, 160px, 230px, 290px;
    }
    100% {
      background-position-y: -15px, 30px, -30px, 30px, 0, 30px;
      background-position-x: -20px, 30px, 80px, 140px, 200px, 270px;
    }
  }
`;

const DisableContainer = styled.div<WidthProps>`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  width: 348px;
  height: 53px;
  background: ${({ theme }) => theme.palette.background.cardDisabled};
  display: flex;
  justify-content: left;
  align-items: center;
  cursor: not-allowed;
  ${width}
`;

const ClockInfoContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
`;

const DateLabel = styled(Typography)`
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  text-align: left;
  color: ${({ theme }) => theme.palette.bullet.white};
`;

const DisabledDate = styled(Typography)`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: left;
  color: ${({ theme }) => theme.palette.background.separator};
`;

export interface ReminderProps extends WidthProps {
  date: string;
  disabled: boolean;
}

export const Reminder: FC<ReminderProps> = ({
  date,
  disabled,
  ...restProps
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isSelected, setisSelected] = useState(false);
  const theme = useTheme();

  return !disabled ? (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setisSelected(!isSelected)}
      onMouseLeave={() => setIsHover(false)}
      $isSelected={isSelected}
      $isHover={isHover}
      {...restProps}
    >
      <Flex p={2}>
        <ClockIcon
          fill={
            isHover && !isSelected
              ? `url(#${svgGradients.gold})`
              : theme.palette.bullet.white
          }
        />
        <DateLabel ml={3}>{date}</DateLabel>
      </Flex>
    </StyledContainer>
  ) : (
    <DisableContainer {...restProps}>
      <Flex p="1rem">
        <ClockIcon fill={theme.palette.background.separator} />
        <DisabledDate ml={3}>{date}</DisabledDate>
        <ClockInfoContainer>
          <InformationIcon
            fill={theme.palette.background.danger}
            $width={15}
            $height={15}
          />
        </ClockInfoContainer>
      </Flex>
    </DisableContainer>
  );
};
