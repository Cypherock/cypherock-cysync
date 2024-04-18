import React, { FC, useState } from 'react';
import { styled } from 'styled-components';

import {
  clockBgDefault,
  clockBgHover,
  clockDefault,
  clockHover,
  clockDisabled,
  ClockInfo,
} from '../../assets';

const Flex = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex-direction: row;
  padding-left: 24px;
  font-family: Poppins;
`;

const DisableContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  width: 348px;
  height: 53px;
  background: #282522;
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

const ClockDefaultImage = styled.img.attrs({
  src: clockDefault,
  alt: 'clock',
})``;

const ClockHoverImage = styled.img.attrs({
  src: clockHover,
  alt: 'clock hover',
})``;

const ClockDisableImage = styled.img.attrs({
  src: clockDisabled,
  alt: 'clock disabled',
})``;

const ClockInfoImage = styled.img.attrs({
  src: ClockInfo,
  alt: 'clock info',
})``;

export interface ReminderProps {
  date: string;
  disabled: boolean;
}

export const Reminder: FC<ReminderProps> = ({ date, disabled }) => {
  const [isHover, setIsHover] = useState(false);
  const [isSelected, setisSelected] = useState(false);

  const StyledContainer = styled.div`
    &:hover {
      box-shadow: ${!isSelected
        ? '0px 0px 12px 4px #1B1813'
        : '0px 0px 12px 4px #1B1813 inset'};
      background-image: ${!isSelected
        ? `linear-gradient(92.96deg, rgba(96, 58, 23, 0.2) 0%, rgba(0, 0, 0, 0) 52.46%), url(${clockBgHover}), linear-gradient(0deg, #332F2D, #332F2D)`
        : ''};
    }
    border: ${isSelected ? '1px solid #e0bb74' : ''};
    background: ${!isSelected
      ? `linear-gradient(273.07deg, rgba(96, 58, 23, 0.2) 1.52%, rgba(0, 0, 0, 0) 52.42%), url(${clockBgDefault}),linear-gradient(0deg, #2A2A27, #2A2A27)`
      : ` #2A2827`};
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 8px;
    overflow: hidden;
    width: 348px;
    height: 53px;
    color: #ffffff;
  `;
  return !disabled ? (
    <StyledContainer
      onMouseDown={() => setisSelected(true)}
      onMouseUp={() => setisSelected(false)}
      onMouseEnter={() => setIsHover(true)}
      onClick={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="oneInManyContainer"
    >
      <Flex>
        {isHover && !isSelected ? <ClockHoverImage /> : <ClockDefaultImage />}
        <DateLabel>{date}</DateLabel>
      </Flex>
    </StyledContainer>
  ) : (
    <DisableContainer>
      <Flex>
        <ClockDisableImage />
        <DisabledDate>{date}</DisabledDate>
        <ClockInfoContainer>
          <ClockInfoImage />
        </ClockInfoContainer>
      </Flex>
    </DisableContainer>
  );
};
