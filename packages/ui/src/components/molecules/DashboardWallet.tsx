import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';

import {
  goldHoverWallet,
  silverHoverWallet,
  dashWallet,
  noneDefaultPlus,
  noneHoverPlus,
  expireHoverWallet,
  dashedWallet,
} from '../../assets';
import { colors } from '../../themes/color.styled';

export interface DashboardWalletProps {
  isNone: boolean;
  isSilver: boolean;
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

const NoneContainer = styled.div<{ isHover: boolean }>`
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
`;

const Container = styled.div<{ backgroundImage: string }>`
  width: 250px;
  height: 220px;
  background: ${({ backgroundImage }) => `url(${backgroundImage})`};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Flex = styled.div<{ isHover: boolean }>`
  display: flex;
  width: 45%;
  padding: 8px 15px;
  ${({ isHover }) =>
    css`
      height: ${isHover ? 'unset' : '18px'};
    `}
`;

const Type = styled.div<{ isSilver: boolean }>`
  font-family: 'Poppins';
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-transform: uppercase;
  background: ${({ isSilver }) =>
    isSilver ? colors.gradients.secondary : colors.text.gold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  right: 45%;
`;

const Expiring = styled.div`
  font-family: 'Poppins';
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
  color: ${colors.text.error};
`;

const Timer = styled.div<{ background: string }>`
  width: 100px;
  box-sizing: border-box;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0px 0px 2px -2px ${colors.boxShadow.timer.main};
  background: ${({ background }) => background}, ${colors.background.timer.main};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TimerContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const TimerText = styled.div<{
  isHover: boolean;
  isSilver: boolean;
  isExpiring: boolean;
}>`
  box-shadow: 0px 0px 2px -2px ${colors.boxShadow.timer.text};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 90px;
  border-radius: 50%;
  height: 90px;
  background-color: ${({ isHover, isSilver, isExpiring }) =>
    getTimerTextBackgroundColor(isHover, isSilver, isExpiring)};
`;

const getTimerTextBackgroundColor = (
  isHover: boolean,
  isSilver: boolean,
  isExpiring: boolean,
) => {
  if (isHover) {
    if (isSilver) return colors.background.timer.silver;
    if (isExpiring) return colors.background.timer.expiring;
    return colors.background.timer.deafult;
  }
  return colors.background.timer.secondary;
};

const TimerHead = styled.div<{ isHover: boolean }>`
  font-family: 'Poppins';
  font-size: ${({ isHover }) => (isHover ? '11px' : '10px')};
  font-weight: ${({ isHover }) => (isHover ? '700' : '400')};
  line-height: 16.5px;
  text-align: left;
  color: ${({ isHover }) => (isHover ? 'white' : colors.background.muted)};
`;

const getColor = (isExpiring: boolean, isHover: boolean) => {
  if (isExpiring && isHover) return colors.background.muted;
  if (isExpiring) return colors.warning.main;
  if (isHover) return colors.background.muted;
  return 'white';
};

const TimerSubtitle = styled.div<{ isHover: boolean; isExpiring: boolean }>`
  font-family: 'Poppins';
  font-size: 10px;
  font-weight: ${({ isHover }) => (isHover ? '400' : '700')};
  line-height: 18px;
  text-align: left;
  color: ${({ isExpiring, isHover }) => getColor(isExpiring, isHover)};
`;

const WalletName = styled.div<{ isHover: boolean; isExpiring: boolean }>`
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 600;
  line-height: 27px;
  text-align: center;
  margin-bottom: 30px;
  color: ${({ isHover, isExpiring }) =>
    isHover && isExpiring ? colors.warning.main : colors.text.muted};
  margin-top: 18px;
`;

const HoverPlusContainer = styled.div`
  padding-top: 10px;
`;

const WalletSubtitle = styled.div`
  margin-top: 16px;
`;

export const DashboardWallet: FC<DashboardWalletProps> = ({
  isNone,
  isSilver,
  isExpiring,
  timerDate,
  name,
  walletSubtitle,
}) => {
  const [isHover, setIsHover] = useState(false);

  const getBackgroundImage = () => {
    if (isHover) {
      if (isSilver) return silverHoverWallet;
      if (isExpiring) return expireHoverWallet;
      return goldHoverWallet;
    }
    return dashWallet;
  };

  const getTimerBackground = () => {
    if (isHover) {
      if (isSilver) return colors.gradients.conicGradient.secondary;
      if (isExpiring) return colors.gradients.conicGradient.expirig;
      return colors.gradients.conicGradient.golden;
    }
    if (isSilver) return colors.gradients.conicGradient.silver;
    if (isExpiring) return colors.gradients.conicGradient.notExpiring;
    return colors.gradients.conicGradient.default;
  };

  const getTypeText = () => {
    if (isHover) {
      return isSilver ? 'Silver' : 'Gold';
    }
    return ' ';
  };

  const getExpiringText = () => {
    if (isHover && !isSilver && isExpiring) {
      return 'Expiring';
    }
    return ' ';
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
    >
      <Flex isHover={isHover}>
        <Type isSilver={isSilver}>{getTypeText()}</Type>
        <Expiring>{getExpiringText()}</Expiring>
      </Flex>
      <TimerContainer>
        <Timer background={getTimerBackground()}>
          <TimerText
            isHover={isHover}
            isSilver={isSilver}
            isExpiring={isExpiring}
          >
            <TimerHead isHover={isHover}>
              {isHover ? 'Created' : 'Expiry'}
            </TimerHead>
            <TimerSubtitle isHover={isHover} isExpiring={isExpiring}>
              {timerDate}
            </TimerSubtitle>
          </TimerText>
        </Timer>
      </TimerContainer>
      <WalletName isHover={isHover} isExpiring={isExpiring}>
        {name}
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
