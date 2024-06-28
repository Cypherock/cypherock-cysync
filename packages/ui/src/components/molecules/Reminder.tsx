import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import { Flex } from '../atoms/Flex';
import { Clock, ClockDisabled, ClockHover, ClockInfo } from '../../assets';
import ClockBgHoverURL from '../../../icons/clock-bg-hover.svg';
import ClockBgDefaultURL from '../../../icons/clock-bg-default.svg';

const DisableContainer = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  width: 348px;
  height: 53px;
  background: #282522;
  display: flex;
  justify-content: left;
  align-items: center;
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
  color: white !important;
`;

const DisabledDate = styled.p`
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: left;
  margin-left: 24px;
  color: #39322c;
`;

// const ClockDefaultImage = styled.img.attrs({
//   src: clockDefault,
//   alt: 'clock',
// })``;

// const ClockHoverImage = styled.img.attrs({
//   src: clockHover,
//   alt: 'clock hover',
// })``;

// const ClockDisableImage = styled.img.attrs({
//   src: clockDisabled,
//   alt: 'clock disabled',
// })``;

// const ClockInfoImage = styled.img.attrs({
//   src: ClockInfo,
//   alt: 'clock info',
// })``;

export interface ReminderProps {
  date: string;
  disabled: boolean;
}

export const Reminder: FC<ReminderProps> = ({ date, disabled }) => {
  const [isHover, setIsHover] = useState(false);
  const [isSelected, setisSelected] = useState(false);

  const StyledContainer = styled.div`
  transition: background 1s ease-in-out, box-shadow 1s ease-in-out; 
  &:hover {
    box-shadow: ${
      !isSelected
        ? '0px 0px 12px 4px #1B1813'
        : '0px 0px 12px 4px #1B1813 inset'
    };
    background: ${
      !isSelected
        ? `linear-gradient(92.96deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 52.46%), url(${ClockBgHoverURL}), linear-gradient(0deg, #332F2D, #332F2D)`
        : ''
    };
  }

  border: ${isSelected ? '1px solid #e0bb74' : ''};
  background: ${
    !isSelected
      ? `linear-gradient(273.07deg, rgba(96, 58, 23, 0.2) 1.52%, rgba(0, 0, 0, 0) 52.42%), url(${ClockBgDefaultURL}),linear-gradient(0deg, #2A2A27, #2A2A27)`
      : `#2A2827`
  };
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  width: 348px;
  height: 53px;
  color: #ffffff;
  animation: ${
    !isSelected && isHover ? 'backgroundAnimation 1s ease-in-out' : 'none'
  };
  }
`;

  return !disabled ? (
    <StyledContainer
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setisSelected(!isSelected)}
      onMouseLeave={() => setIsHover(false)}
      className="oneInManyContainer"
    >
      <Flex p={2}>
        {isHover && !isSelected ? <ClockHover /> : <Clock />}
        <DateLabel>{date}</DateLabel>
      </Flex>
    </StyledContainer>
  ) : (
    <DisableContainer>
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
