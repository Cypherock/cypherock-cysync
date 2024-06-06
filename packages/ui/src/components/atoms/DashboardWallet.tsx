import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';

import {
  checkTick,
  info,
  goldHoverWallet,
  silverHoverWallet,
  dashWallet,
  noneDefaultPlus,
  noneHoverPlus,
  expireHoverWallet,
  dashedWallet,
} from '../../assets';

export interface DashboardWalletProps {
  isNone: boolean;
  isSilver: boolean;
  isExpiring: boolean;
  isVerified: boolean;
  timerDate: string;
  name: string;
  walletSubtitle: string;
}

const InfoImage = styled.img.attrs({
  src: info,
  alt: 'info',
  width: '14px',
  height: '14px',
})``;

const TickImage = styled.img.attrs({
  src: checkTick,
  alt: 'checkTick',
  width: '12px',
  height: '10px',
})``;

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
  justify-content: space-between;
  padding: 8px 15px;
  ${({ isHover }) =>
    css`
      height: ${isHover ? 'unset' : '18px'};
    `}
`;

const Check = styled.div<{ isVerified: boolean; isHover: boolean }>`
  display: flex;
  justify-content: end;
  font-family: 'Poppins';
  font-size: 10px;
  font-weight: 400;
  line-height: 15px;
  text-align: center;
  color: ${({ isVerified }) => (isVerified ? '#51C61A' : '#F1AE4A')};
  position: relative;
  ${({ isHover }) =>
    css`
      height: ${isHover ? 'unset' : '15px'};
      left: ${isHover ? '30%' : '35%'};
      top: ${isHover ? '' : '10px'};
    `}
`;

const Type = styled.div`
  font-family: 'Poppins';
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  background: linear-gradient(
    90deg,
    #e9b873 0.19%,
    #fedd8f 37.17%,
    #b78d51 100.19%
  );
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
  color: #ff624c;
`;

const Timer = styled.div<{ background: string }>`
  width: 100px;
  box-sizing: border-box;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0px 0px 2px -2px #2e2523;
  background: ${({ background }) => background}, #3e3a38;
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
  box-shadow: 0px 0px 2px -2px #242322;
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
    if (isSilver) return '#26221e';
    if (isExpiring) return '#271a15';
    return '#261f17';
  }
  return '#2a2827';
};

const TimerHead = styled.div<{ isHover: boolean }>`
  font-family: 'Poppins';
  font-size: 11px;
  font-weight: ${({ isHover }) => (isHover ? '700' : '400')};
  line-height: 16.5px;
  text-align: left;
  color: ${({ isHover }) => (isHover ? 'white' : '#8B8682')};
`;

const TimerSubtitle = styled.div<{ isHover: boolean }>`
  font-family: 'Poppins';
  font-size: 12px;
  font-weight: ${({ isHover }) => (isHover ? '400' : '700')};
  line-height: 18px;
  text-align: left;
  color: ${({ isHover }) => (isHover ? '#8B8682' : 'white')};
`;

const WalletName = styled.div<{ isHover: boolean; isExpiring: boolean }>`
  font-family: 'Poppins';
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
  text-align: center;
  margin-bottom: 30px;
  color: ${({ isHover, isExpiring }) =>
    isHover && isExpiring ? '#FF624C' : '#8B8682'};
  margin-top: 18px;
`;

export const DashboardWallet: FC<DashboardWalletProps> = ({
  isNone,
  isSilver,
  isExpiring,
  isVerified,
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
      if (isSilver)
        return 'conic-gradient(from 0deg, #A2ADB3 ,33deg, #F3F1F2, 67deg, #BCC3C9, 101deg, #DCDFE4,135deg ,transparent, 135deg, transparent)';
      if (isExpiring)
        return 'conic-gradient(from 0deg, #FF624C ,270deg, #FF624C,270deg ,transparent, 270deg, transparent)';
      return 'conic-gradient(from 0deg, #E9B873 ,30deg, #FEDD8F, 60deg, #B78D51, 90deg ,transparent, 90deg, transparent)';
    }
    if (isSilver)
      return 'conic-gradient(from 0deg, transparent,135deg, transparent, 135deg, #A2ADB3 ,191deg, #F3F1F2, 247deg, #BCC3C9, 304deg, #DCDFE4, 360deg ,transparent, 360deg, transparent)';
    if (isExpiring)
      return 'conic-gradient(from 0deg, transparent, 270deg, transparent, 270deg, #E9B873 ,300deg, #FEDD8F, 330deg, #B78D51, 360deg ,transparent, 360deg, transparent)';
    return 'conic-gradient(from 0deg, transparent,90deg, transparent, 90deg, #E9B873 ,180deg, #FEDD8F, 270deg, #B78D51, 360deg ,transparent, 360deg, transparent)';
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

  const getCheckText = () => {
    if (isHover) {
      return isVerified ? 'Verified' : 'Not Verified';
    }
    return isVerified ? <TickImage /> : <InfoImage />;
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
        <Type>{getTypeText()}</Type>
        <Expiring>{getExpiringText()}</Expiring>
      </Flex>
      <Check isVerified={isVerified} isHover={isHover}>
        {getCheckText()}
      </Check>
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
            <TimerSubtitle isHover={isHover}>{timerDate}</TimerSubtitle>
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
        <div style={{ paddingTop: '10px' }}>
          <NoneHoverPlusImage />
          <div style={{ marginTop: '16px' }}>{walletSubtitle}</div>
        </div>
      ) : (
        <NoneDefaultPlusImage />
      )}
    </NoneContainer>
  );
};