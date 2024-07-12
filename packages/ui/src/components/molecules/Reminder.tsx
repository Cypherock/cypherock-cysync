import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '../atoms/Flex';
import {
  Clock,
  ClockDisabled,
  ClockHover,
  ClockInfo,
  mainClock,
} from '../../assets';
import { WidthProps, width } from '../utils';
import { theme } from '../../themes/theme.styled';

const StyledContainer = styled.div<
  WidthProps & { isSelected: boolean; isHover: boolean }
>`
  position: relative;
  background: ${props =>
    !props.isSelected
      ? `linear-gradient(273deg, rgba(96, 58, 23, 0.20) 1.52%, rgba(0, 0, 0, 0.00) 52.42%), #2A2A27`
      : theme.palette.text.selected};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  width: 348px;
  height: 53px;
  color: ${theme.palette.bullet.white};
  z-index: 1;
  box-shadow: ${props =>
    props.isSelected
      ? `0px 0px 12px 4px ${theme.palette.shadow.selected} inset`
      : `0px 0px 12px 4px ${theme.palette.shadow.selected}`};
  border: ${props =>
    props.isSelected ? `1px solid ${theme.palette.border.selected}` : ''};

  ${width}

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${props =>
        props.isSelected
          ? ''
          : `url(${mainClock}), url(${mainClock}), url(${mainClock})`},
      url(${mainClock}), url(${mainClock}), url(${mainClock});
    background-size: 40px 40px;
    background-repeat: no-repeat;
    background-position: -20px -15px, 30px 30px, 80px -30px, 140px 30px, 200px 0,
      270px 30px;
    z-index: -1;
    animation: ${props =>
      !props.isSelected && props.isHover
        ? 'moveBackgrounds 1s ease-in-out forwards'
        : ''};
  }

  &:hover {
    border-radius: var(--8-px, 8px);
    background: ${props =>
      props.isSelected
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
  background: ${theme.palette.text.disabledBackground};
  display: flex;
  justify-content: left;
  align-items: center;
  cursor: not-allowed;
  ${width}
`;

const ClockInfoContainer = styled.div`
  position: absolute;
  top: 13px;
  right: 18px;
  cursor: pointer;
`;

const DateLabel = styled.p`
  font-family: Poppins;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  text-align: left;
  margin-left: 24px;
  color: ${theme.palette.bullet.white} !important;
`;

const DisabledDate = styled.p`
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: left;
  margin-left: 24px;
  color: ${theme.palette.background.separator};
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

  return !disabled ? (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setisSelected(!isSelected)}
      onMouseLeave={() => setIsHover(false)}
      isSelected={isSelected}
      isHover={isHover}
      {...restProps}
    >
      <Flex p={2}>
        {isHover && !isSelected ? <ClockHover /> : <Clock />}
        <DateLabel>{date}</DateLabel>
      </Flex>
    </StyledContainer>
  ) : (
    <DisableContainer {...restProps}>
      <Flex p="1rem">
        <ClockDisabled />
        <DisabledDate>{date}</DisabledDate>
        <ClockInfoContainer>
          <ClockInfo />
        </ClockInfoContainer>
      </Flex>
    </DisableContainer>
  );
};
