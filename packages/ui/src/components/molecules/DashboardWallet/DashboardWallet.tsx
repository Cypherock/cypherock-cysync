import React, { FC, useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';
import { DefaultTheme } from 'styled-components/dist/types';

import {
  SetupCoverPlusImage,
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
  SetupCoverContainer,
  SetupCoverText,
} from './DashbboardWallet.styled';
import {
  calculateHoverText,
  getBackgroundImage,
  getExpiringText,
  getPathColor,
  getTimerHeadText,
  getTypeText,
  updateHoverOnly,
  updateProgressAndHover,
} from './utils';

import { useTheme } from '../../../themes';
import { WidthProps } from '../../utils';
import { format } from 'date-fns';

export interface DashboardWalletProps extends WidthProps {
  isNone: boolean;
  type: 'silver' | 'gold';
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
        setupCover: string;
      };
    };
  };
  startDate: string;
  expiryDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

export const DashboardWallet: FC<DashboardWalletProps> = ({
  isNone,
  type,
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
        type,
        isExpiring,
        paymentPending,
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
      {isNone && (
        <SetupCoverContainer>
          <SetupCoverPlusImage isHover={isHover} />
          <SetupCoverText isHover={isHover}>
            {lang.dashboard.wallet.setupCover}
          </SetupCoverText>
        </SetupCoverContainer>
      )}
      {!isNone && (
        <>
          <Flex isHover={isHover}>
            <Type type={type} isHover={isHover}>
              {getTypeText(type, lang)}
            </Type>
            <Expiring isHover={isHover} disableTransform={isExpired}>
              {getExpiringText(isExpiring, isExpired, lang)}
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
                    paymentPending,
                    theme,
                    type,
                  ),
                  trailColor: theme.palette.background.timer.main,
                  rotation: isHover
                    ? hoverProgress.rotation
                    : progress.rotation,
                  pathTransition:
                    isExpired || paymentPending
                      ? 'none'
                      : 'all 0.4s ease-in-out 0s',
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
                    {getTimerHeadText(isHover, isExpired, paymentPending, lang)}
                  </TimerHead>
                </TransitionText>
                <TransitionText isHover={!isHover}>
                  <TimerHead
                    isHover={isHover}
                    isExpired={isExpired}
                    paymentPending={paymentPending}
                  >
                    {getTimerHeadText(isHover, isExpired, paymentPending, lang)}
                  </TimerHead>
                </TransitionText>
              </TransitionTextWrapper>
              <TransitionTextWrapper>
                <TransitionTextSubtitle isHover={isHover}>
                  <TimerSubtitle
                    isHover={isHover}
                    isExpiring={isExpiring}
                    isExpired={isExpired}
                    paymentPending={paymentPending}
                  >
                    {format(new Date(startDate), 'dd MMM yyyy')}
                  </TimerSubtitle>
                </TransitionTextSubtitle>
                <TransitionTextSubtitle isHover={!isHover}>
                  <TimerSubtitle
                    isHover={isHover}
                    isExpiring={isExpiring}
                    isExpired={isExpired}
                    paymentPending={paymentPending}
                  >
                    {format(new Date(expiryDate), 'dd MMM yyyy')}
                  </TimerSubtitle>
                </TransitionTextSubtitle>
              </TransitionTextWrapper>
            </TimerText>
          </TimerContainer>
          {isExpired && <StyledExpiredPlanIcon />}
          {paymentPending && (
            <StyledExpiredClockIcon fill={theme.palette.info.main} />
          )}
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
