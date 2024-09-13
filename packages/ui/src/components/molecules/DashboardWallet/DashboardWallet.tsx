import React, { FC, useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import 'react-circular-progressbar/dist/styles.css';

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
  StyledExpiringPlanIcon,
} from './DashbboardWallet.styled';
import {
  calculateHoverText,
  getBackgroundImage,
  getExpiringText,
  getPathColor,
  getTimerHeadText,
  getTypeText,
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
  isPaymentPending: boolean;
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
  startDate: number;
  expiryDate: number;
  onClick?: () => void;
}

export const DashboardWallet: FC<DashboardWalletProps> = ({
  isNone,
  type,
  isExpiring,
  isExpired,
  isPaymentPending,
  name,
  lang,
  startDate,
  expiryDate,
  onClick,
  ...restProps
}) => {
  const [isHover, setIsHover] = useState(false);
  const [progress, setProgress] = useState({ value: 0, rotation: 0 });
  const theme = useTheme();
  const hoverText = calculateHoverText(
    isExpiring,
    isExpired,
    isPaymentPending,
    name,
    lang,
  );
  const disableAnimation = name === hoverText;
  const [hoverProgress, setHoverProgress] = useState({ value: 0, rotation: 0 });

  useEffect(() => {
    updateProgressAndHover({
      startDate,
      expiryDate,
      isExpired,
      isPaymentPending,
      setProgress,
      setHoverProgress,
    });
  }, [startDate, expiryDate, isExpired, isPaymentPending]);

  return (
    <Container
      $isHover={isHover}
      $backgroundImage={getBackgroundImage(
        isHover,
        isExpired,
        type,
        isExpiring,
        isPaymentPending,
      )}
      $isNone={isNone}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') setIsHover(true);
      }}
      {...restProps}
    >
      {isNone && (
        <SetupCoverContainer>
          <SetupCoverPlusImage $isHover={isHover} />
          <SetupCoverText $isHover={isHover}>
            {lang.dashboard.wallet.setupCover}
          </SetupCoverText>
        </SetupCoverContainer>
      )}
      {!isNone && (
        <>
          <Flex $isHover={isHover}>
            <Type type={type} $isHover={isHover}>
              {getTypeText(type, lang)}
            </Type>
            <Expiring $isHover={isHover} $disableTransform={isExpired}>
              {getExpiringText(isExpiring, isExpired, lang)}
            </Expiring>
          </Flex>
          <TimerContainer $isHover={isHover}>
            <ProgressbarWrapper>
              <CircularProgressbar
                value={isHover ? hoverProgress.value : progress.value}
                strokeWidth={6}
                styles={buildStyles({
                  pathColor: getPathColor(
                    isHover,
                    isExpired,
                    isExpiring,
                    isPaymentPending,
                    theme,
                    type,
                  ),
                  trailColor: theme.palette.background.timer.main,
                  rotation: isHover
                    ? hoverProgress.rotation
                    : progress.rotation,
                  pathTransition:
                    isExpired || isPaymentPending
                      ? 'none'
                      : 'all 0.4s ease-in-out 0s',
                })}
              />
            </ProgressbarWrapper>
            <TimerText $isHover={isHover}>
              <TransitionTextWrapper>
                <TransitionText $isHover={isHover}>
                  <TimerHead
                    $isHover={isHover}
                    $isExpired={isExpired}
                    $isPaymentPending={isPaymentPending}
                  >
                    {getTimerHeadText(
                      isHover,
                      isExpired,
                      isPaymentPending,
                      lang,
                    )}
                  </TimerHead>
                </TransitionText>
                <TransitionText $isHover={!isHover}>
                  <TimerHead
                    $isHover={isHover}
                    $isExpired={isExpired}
                    $isPaymentPending={isPaymentPending}
                  >
                    {getTimerHeadText(
                      isHover,
                      isExpired,
                      isPaymentPending,
                      lang,
                    )}
                  </TimerHead>
                </TransitionText>
              </TransitionTextWrapper>
              <TransitionTextWrapper>
                <TransitionTextSubtitle $isHover={isHover}>
                  <TimerSubtitle
                    $isHover={isHover}
                    $isExpiring={isExpiring}
                    $isExpired={isExpired}
                    $isPaymentPending={isPaymentPending}
                  >
                    {format(new Date(startDate), 'dd MMM yyyy')}
                  </TimerSubtitle>
                </TransitionTextSubtitle>
                <TransitionTextSubtitle $isHover={!isHover}>
                  <TimerSubtitle
                    $isHover={isHover}
                    $isExpiring={isExpiring}
                    $isExpired={isExpired}
                    $isPaymentPending={isPaymentPending}
                  >
                    {format(new Date(expiryDate), 'dd MMM yyyy')}
                  </TimerSubtitle>
                </TransitionTextSubtitle>
              </TransitionTextWrapper>
            </TimerText>
          </TimerContainer>
          {isExpiring && <StyledExpiringPlanIcon />}
          {isExpired && <StyledExpiredPlanIcon />}
          {isPaymentPending && (
            <StyledExpiredClockIcon fill={theme.palette.info.main} />
          )}
          <WalletNameContainer
            $isHover={isHover}
            $isExpiring={isExpiring}
            $isExpired={isExpired}
            $isPaymentPending={isPaymentPending}
          >
            {disableAnimation && name}
            <WalletNameText
              $isHover={!isHover}
              $disableAnimation={disableAnimation}
            >
              {name}
            </WalletNameText>
            <WalletNameHoverText
              $isHover={isHover}
              $disableAnimation={disableAnimation}
            >
              {hoverText}
            </WalletNameHoverText>
          </WalletNameContainer>
        </>
      )}
    </Container>
  );
};

DashboardWallet.defaultProps = {
  onClick: undefined,
};
