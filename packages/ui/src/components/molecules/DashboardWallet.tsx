import React, { FC, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import styled from 'styled-components';
import 'react-circular-progressbar/dist/styles.css';

import {
  goldHoverWallet,
  silverHoverWallet,
  dashWallet,
  noneDefaultPlus,
  noneHoverPlus,
  expireHoverWallet,
  dashedWallet,
} from '../../assets';
import { theme } from '../../themes/theme.styled';
import { WidthProps, width } from '../utils';

export interface DashboardWalletProps extends WidthProps {
  isNone: boolean;
  planType: 'silver' | 'gold';
  isExpiring: boolean;
  timerDate: string;
  name: string;
  walletSubtitle: string;
}

const NoneHoverPlusImage = styled.img.attrs({
  src: noneHoverPlus,
  alt: 'noneHoverPlus',
})``;

const NoneDefaultPlusImage = styled.img.attrs({
  src: noneDefaultPlus,
  alt: 'noneDefaultPlus',
})``;

const NoneContainer = styled.div<{ isHover: boolean } & WidthProps>`
  width: 250px;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  text-align: center;
  color: white;
  background: ${({ isHover }) => `url(${isHover ? dashedWallet : dashWallet})`};
  ${width}
`;

const Container = styled.div<{ backgroundImage: string } & WidthProps>`
  width: 250px;
  height: 220px;
  background: ${({ backgroundImage }) => `url(${backgroundImage})`};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  ${width}
`;

const Flex = styled.div<{ isHover: boolean }>`
  display: flex;
  width: 45%;
  padding: 8px 15px;
  ${({ isHover }) => (isHover ? 'height: unset;' : 'height: 18px;')}
`;

const Type = styled.div<{ planType: string }>`
  font-family: 'Poppins';
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-transform: uppercase;
  background: ${({ planType }) =>
    planType === 'silver'
      ? theme.palette.background.secondary
      : theme.palette.text.gold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  right: 85%;
`;

const Expiring = styled.div`
  font-family: 'Poppins';
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
  color: ${theme.palette.error.main};
  position: relative;
  right: 20%;
`;

const TimerContainer = styled.div<{ isHover: boolean }>`
  display: flex;
  justify-content: center;
  width: 90px;
  height: 90px;
  align-items: center;
  margin-top: ${({ isHover }) => (isHover ? '0' : '14px')};
`;

const TimerText = styled.div<{ isHover: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins';
  font-size: 14px;
  color: white;
  text-align: center;
  position: absolute;
  border-radius: 40px;
  height: 78px;
  width: 78px;
  fill: #3e3a38;
  filter: drop-shadow(0px 0px 2px #242322);
`;

const TimerHead = styled.div<{ isHover: boolean }>`
  font-family: 'Poppins';
  font-size: ${({ isHover }) => (isHover ? '11px' : '10px')};
  font-weight: ${({ isHover }) => (isHover ? '700' : '400')};
  line-height: 16.5px;
  text-align: left;
  color: ${({ isHover }) => (isHover ? 'white' : theme.palette.muted.main)};
`;

const getColor = (isExpiring: boolean, isHover: boolean) => {
  if (isExpiring && isHover) {
    return theme.palette.muted.main;
  }
  if (isExpiring) {
    return theme.palette.warn.main;
  }
  if (isHover) {
    return theme.palette.muted.main;
  }
  return 'white';
};

const getFontWeight = (isHover: boolean) => (isHover ? '400' : '700');

const TimerSubtitle = styled.div<{ isHover: boolean; isExpiring: boolean }>`
  font-family: 'Poppins';
  font-size: 10px;
  font-weight: ${({ isHover }) => getFontWeight(isHover)};
  line-height: 18px;
  text-align: left;
  color: ${({ isExpiring, isHover }) => getColor(isExpiring, isHover)};
`;

const getWalletNameColor = (
  isHover: boolean,
  isExpiring: boolean,
  planType: string,
) => {
  if (isHover && isExpiring) {
    return planType === 'silver' ? '#A2ADB3' : '#E9B873';
  }
  return theme.palette.muted.main;
};

const WalletName = styled.div<{
  isHover: boolean;
  isExpiring: boolean;
  planType: string;
}>`
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 600;
  line-height: 27px;
  text-align: center;
  margin-bottom: 30px;
  margin-top: 18px;
  color: ${({ isHover, isExpiring, planType }) =>
    getWalletNameColor(isHover, isExpiring, planType)};
`;

const HoverPlusContainer = styled.div`
  padding-top: 10px;
`;

const WalletSubtitle = styled.div`
  margin-top: 16px;
`;

export const DashboardWallet: FC<DashboardWalletProps> = ({
  isNone,
  planType,
  isExpiring,
  timerDate,
  name,
  walletSubtitle,
  ...restProps
}) => {
  const [isHover, setIsHover] = useState(false);

  const getBackgroundImage = () => {
    if (isHover) {
      if (planType === 'silver') return silverHoverWallet;
      if (isExpiring) return expireHoverWallet;
      return goldHoverWallet;
    }
    return dashWallet;
  };

  const getTypeText = () => {
    if (isHover) {
      return planType === 'silver' ? 'Silver' : 'Gold';
    }
    return ' ';
  };

  const getExpiringText = () => {
    if (isHover && isExpiring) {
      return 'Expiring';
    }
    return ' ';
  };

  const getProgressProps = () => {
    if (isExpiring) {
      if (isHover) {
        return { value: 75, rotation: 0.01 };
      }
      return { value: 25, rotation: 0.75 };
    }
    if (planType === 'silver') {
      if (isHover) {
        return { value: 35, rotation: 0.02 };
      }
      return { value: 60, rotation: 0.4 };
    }
    if (isHover) {
      return { value: 20, rotation: 0.02 };
    }
    return { value: 80, rotation: 0.2 };
  };

  const progressProps = getProgressProps();

  const getPathColor = () => {
    if (isHover && isExpiring) {
      return '#FF624C';
    }
    if (planType === 'silver') {
      return '#A2ADB3';
    }
    return '#E9B873';
  };

  return !isNone ? (
    <Container
      backgroundImage={getBackgroundImage()}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => setIsHover(true)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') setIsHover(true);
      }}
      {...restProps}
    >
      <Flex isHover={isHover}>
        <Type planType={planType}>{getTypeText()}</Type>
        <Expiring>{getExpiringText()}</Expiring>
      </Flex>
      <TimerContainer isHover={isHover}>
        <CircularProgressbar
          value={progressProps.value}
          strokeWidth={6}
          styles={buildStyles({
            pathColor: getPathColor(),
            trailColor: '#3E3A38',
            rotation: progressProps.rotation,
          })}
        />
        <TimerText isHover={isHover}>
          <TimerHead isHover={isHover}>
            {isHover ? 'Created' : 'Expiry'}
          </TimerHead>
          <TimerSubtitle isHover={isHover} isExpiring={isExpiring}>
            {timerDate}
          </TimerSubtitle>
        </TimerText>
      </TimerContainer>
      <WalletName isHover={isHover} isExpiring={isExpiring} planType={planType}>
        {isHover && isExpiring ? 'Renew Now' : name}
      </WalletName>
    </Container>
  ) : (
    <NoneContainer
      isHover={isHover}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => setIsHover(true)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') setIsHover(true);
      }}
      {...restProps}
    >
      {isHover ? (
        <HoverPlusContainer>
          <NoneHoverPlusImage />
          <WalletSubtitle>{walletSubtitle}</WalletSubtitle>
        </HoverPlusContainer>
      ) : (
        <NoneDefaultPlusImage />
      )}
    </NoneContainer>
  );
};
