import React, { FC, useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';
import { DefaultTheme } from 'styled-components/dist/types';

import {
  NoneDefaultPlusImage,
  ProgressbarWrapper,
  Container,
  StyledExpiredPlanIcon,
  StyledExpiredClockIcon,
  Flex,
  Type,
  Expiring,
  TimerContainer,
  TimerText,
  TimerHead,
  TimerSubtitle,
  WalletNameContainer,
  WalletNameText,
  WalletNameHoverText,
  TransitionTextWrapper,
  TransitionText,
  TransitionTextSubtitle,
} from './DashbboardWallet.styled';
import {
  calculateHoverText,
  getBackgroundImage,
  getCurrentFullTime,
  getCurrentTime,
  getExpiringText,
  getPathColor,
  getTimerHeadText,
  getTypeText,
  updateHoverOnly,
  updateProgressAndHover,
} from './utils';

import { useTheme } from '../../../themes';
import { WidthProps } from '../../utils';

export interface DashboardWalletProps extends WidthProps {
  isNone: boolean;
  planType: 'silver' | 'gold';
  isExpiring: boolean;
  isExpired: boolean;
  paymentPending: boolean;
  name: string;
  lang: {
    dashboard: {
      wallet: {
        renewNow: string;
        buyNow: string;
        created: string;
        expiredOn: string;
        expiresIn: string;
        expiry: string;
        expiring: string;
        expired: string;
        pendingTime: string;
        silver: string;
        gold: string;
        hours: string;
      };
    };
  };
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

export const DashboardWallet: FC<DashboardWalletProps> = ({
  isNone,
  planType,
  isExpiring,
  isExpired,
  paymentPending,
  name,
  lang,
  startDate,
  expiryDate,
  status,
  ...restProps
}) => {
  const [isHover, setIsHover] = useState(false);
  const [progress, setProgress] = useState({ value: 0, rotation: 0 });
  const theme = useTheme() as DefaultTheme;
  const hoverText = calculateHoverText(
    isExpiring,
    isExpired,
    paymentPending,
    name,
    lang,
  );
  const disableAnimation = name === hoverText;
  const [hoverProgress, setHoverProgress] = useState({ value: 0, rotation: 0 });

  useEffect(() => {
    updateProgressAndHover(
      startDate,
      expiryDate,
      status,
      isExpired,
      paymentPending,
      setProgress,
      setHoverProgress,
    );
  }, [startDate, expiryDate, status, isExpired, paymentPending]);

  useEffect(() => {
    updateHoverOnly(
      startDate,
      expiryDate,
      status,
      setProgress,
      setHoverProgress,
    );
  }, [startDate, expiryDate, status]);

  return (
    <Container
      isHover={isHover}
      backgroundImage={getBackgroundImage(
        isHover,
        isExpired,
        planType,
        isExpiring,
      )}
      isNone={isNone}
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
      {isNone && <NoneDefaultPlusImage isHover={isHover} />}
      {!isNone && (
        <>
          <Flex isHover={isHover}>
            <Type planType={planType} isHover={isHover}>
              {getTypeText(planType, lang)}
            </Type>
            <Expiring isHover={isHover}>
              {getExpiringText(isHover, isExpired, isExpiring, lang)}
            </Expiring>
          </Flex>
          <TimerContainer isHover={isHover}>
            <ProgressbarWrapper>
              <CircularProgressbar
                value={isHover ? hoverProgress.value : progress.value}
                strokeWidth={6}
                styles={buildStyles({
                  pathColor: getPathColor(
                    isHover,
                    isExpired,
                    isExpiring,
                    theme,
                    planType,
                  ),
                  trailColor: theme.palette.background.timer.main,
                  rotation: isHover
                    ? hoverProgress.rotation
                    : progress.rotation,
                })}
              />
            </ProgressbarWrapper>
            <TimerText isHover={isHover}>
              <TransitionTextWrapper>
                <TransitionText isHover={isHover}>
                  <TimerHead
                    isHover={isHover}
                    isExpired={isExpired}
                    paymentPending={paymentPending}
                  >
                    {getTimerHeadText(
                      isHover,
                      isExpired,
                      paymentPending,
                      expiryDate,
                      lang,
                    )}
                  </TimerHead>
                </TransitionText>
                <TransitionText isHover={!isHover}>
                  <TimerHead
                    isHover={isHover}
                    isExpired={isExpired}
                    paymentPending={paymentPending}
                  >
                    {(() => {
                      if (isExpired) {
                        return lang.dashboard.wallet.expiredOn;
                      }
                      if (paymentPending) {
                        return lang.dashboard.wallet.expiresIn;
                      }
                      return lang.dashboard.wallet.expiry;
                    })()}
                  </TimerHead>
                </TransitionText>
              </TransitionTextWrapper>
              <TransitionTextWrapper>
                <TransitionTextSubtitle isHover={isHover}>
                  <TimerSubtitle
                    isHover={isHover}
                    isExpiring={isExpiring}
                    isExpired={isExpired}
                  >
                    {(() => {
                      if (isHover && paymentPending) {
                        return getCurrentFullTime();
                      }
                      if (isHover) {
                        return startDate;
                      }
                      return expiryDate;
                    })()}
                  </TimerSubtitle>
                </TransitionTextSubtitle>
                <TransitionTextSubtitle isHover={!isHover}>
                  <TimerSubtitle
                    isHover={isHover}
                    isExpiring={isExpiring}
                    isExpired={isExpired}
                  >
                    {(() => {
                      if (paymentPending) {
                        return `${getCurrentTime()} ${
                          lang.dashboard.wallet.hours
                        }`;
                      }
                      return expiryDate;
                    })()}
                  </TimerSubtitle>
                </TransitionTextSubtitle>
              </TransitionTextWrapper>
            </TimerText>
          </TimerContainer>
          {isExpired && <StyledExpiredPlanIcon />}
          {paymentPending && <StyledExpiredClockIcon />}
          <WalletNameContainer
            isHover={isHover}
            isExpiring={isExpiring}
            isExpired={isExpired}
            paymentPending={paymentPending}
          >
            {disableAnimation && name}
            <WalletNameText
              isHover={!isHover}
              disableAnimation={disableAnimation}
            >
              {name}
            </WalletNameText>
            <WalletNameHoverText
              isHover={isHover}
              disableAnimation={disableAnimation}
            >
              {hoverText}
            </WalletNameHoverText>
          </WalletNameContainer>
        </>
      )}
    </Container>
  );
};
