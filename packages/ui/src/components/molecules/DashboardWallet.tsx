import React, { FC, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import styled from 'styled-components';
import 'react-circular-progressbar/dist/styles.css';
import { useTheme } from '../../themes';
import {
  goldHoverWalletIcon,
  silverHoverWalletIcon,
  dashWalletDefaultBgIcon,
  noneDefaultPlus,
  expireHoverWalletIcon,
  dashWalletHoverBgIcon,
  ExpiredPlanIcon,
  ExpiredClockIcon,
  WalletDefaultExpiredIcon,
  WalletHoverExpiredIcon,
} from '../../assets';
import { WidthProps, width } from '../utils';
import { DefaultTheme } from 'styled-components/dist/types';

export interface DashboardWalletProps extends WidthProps {
  isNone: boolean;
  planType: 'silver' | 'gold';
  isExpiring: boolean;
  isExpired: boolean;
  paymentPending: boolean;
  timerDate: string;
  name: string;
}

const NoneDefaultPlusImage = styled.img.attrs({
  src: noneDefaultPlus,
  alt: 'noneDefaultPlus',
})``;

const Container = styled.div<
  { isHover: boolean; isNone: boolean; backgroundImage: string } & WidthProps
>`
  width: 200px;
  height: 176px;
  display: flex;
  ${({ isNone }) =>
    isNone ? 'justify-content:  center' : 'justify-content:normal'};
  align-items: center;
  flex-direction: column;
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  text-align: center;
  color: white;
  background: ${({ isHover, isNone, backgroundImage }) =>
    isNone
      ? `url(${isHover ? dashWalletHoverBgIcon : dashWalletDefaultBgIcon})`
      : `url(${backgroundImage})`};
  cursor: pointer;
  position: relative;
  ${width}
`;

const StyledExpiredPlanIcon = styled(ExpiredPlanIcon)`
  position: absolute;
  top: 24px;
  right: 10px;
  height: 14px;
  width: 14px;
`;

const StyledExpiredClockIcon = styled(ExpiredClockIcon)`
  position: absolute;
  top: 24px;
  right: 10px;
  height: 14px;
  width: 14px;
`;

const Flex = styled.div<{ isHover: boolean }>`
  display: flex;
  width: 45%;
  ${({ isHover }) =>
    isHover
      ? 'height: unset;padding: 8px 15px;'
      : 'height: unset;padding: 10px 15px;'}
`;

const Type = styled.div<{ planType: string }>`
  font-family: 'Poppins';
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-transform: uppercase;
  background: ${({ planType, theme }) =>
    planType === 'silver'
      ? theme.palette.background.secondary
      : theme.palette.text.gold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  right: 95%;
`;

const Expiring = styled.div`
  font-family: 'Poppins';
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
  color: ${({ theme }) => theme.palette.error.main};
  position: relative;
  right: 70%;
`;

const TimerContainer = styled.div<{ isHover: boolean }>`
  display: flex;
  justify-content: center;
  width: 90px;
  height: 90px;
  align-items: center;
  margin-top: ${({ isHover }) => (isHover ? '6px' : '20px')};
`;

const TimerText = styled.div<{ isHover: boolean; theme: any }>`
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
  fill: ${({ theme }) => theme.palette.background.timer.main};
  box-shadow: inset 0 0 2px 1px
    ${({ theme }) => theme.palette.boxShadow.timer.main};
`;

const TimerHead = styled.div<{
  isHover: boolean;
  isExpired: boolean;
  paymentPending: boolean;
}>`
  font-family: 'Poppins';
  font-size: ${({ isHover, paymentPending }) => {
    if (isHover) {
      if (paymentPending) {
        return '16px';
      }
      return '10px';
    }
    return '10px';
  }};
  font-weight: ${({ isHover, isExpired }) => {
    if (isExpired) {
      return '700';
    }
    if (isHover) {
      return '700';
    }
    return '400';
  }};
  line-height: 16.5px;
  text-align: left;
  color: ${({ isExpired, isHover, theme }) => {
    if (isExpired) {
      return theme.palette.warn.main;
    }
    if (isHover) {
      return 'white';
    }
    return theme.palette.muted.main;
  }};
`;

const getColor = (
  isExpiring: boolean,
  isHover: boolean,
  isExpired: boolean,
  theme: any,
) => {
  if (isExpiring && isHover) {
    return theme.palette.muted.main;
  }
  if (isExpiring) {
    return theme.palette.warn.main;
  }
  if (isHover) {
    return theme.palette.muted.main;
  }
  if (isExpired) {
    return theme.palette.muted.main;
  }
  return 'white';
};

const getFontWeight = (isHover: boolean, isExpired: boolean) =>
  isHover || isExpired ? '400' : '700';

const TimerSubtitle = styled.div<{
  isHover: boolean;
  isExpiring: boolean;
  isExpired: boolean;
}>`
  font-family: 'Poppins';
  font-size: 10px;
  font-weight: ${({ isHover, isExpired }) => getFontWeight(isHover, isExpired)};
  line-height: 18px;
  text-align: left;
  color: ${({ isExpiring, isHover, isExpired, theme }) =>
    getColor(isExpiring, isHover, isExpired, theme)};
`;

const getWalletNameColor = (
  isHover: boolean,
  isExpiring: boolean,
  isExpired: boolean,
  paymentPending: boolean,
  theme: any,
) => {
  if (isHover && (isExpiring || isExpired || paymentPending)) {
    return theme.palette.background.golden;
  }
  return theme.palette.muted.main;
};

const WalletName = styled.div<{
  isHover: boolean;
  isExpiring: boolean;
  isExpired: boolean;
  paymentPending: boolean;
}>`
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 600;
  line-height: 27px;
  text-align: center;
  margin-bottom: 30px;
  margin-top: 12px;
  color: ${({ isHover, isExpiring, isExpired, paymentPending, theme }) =>
    getWalletNameColor(isHover, isExpiring, isExpired, paymentPending, theme)};
`;

const HoverPlusContainer = styled.div`
  padding-top: 10px;
`;

export const DashboardWallet: FC<DashboardWalletProps> = ({
  isNone,
  planType,
  isExpiring,
  isExpired,
  paymentPending,
  timerDate,
  name,
  ...restProps
}) => {
  const [isHover, setIsHover] = useState(false);
  const theme = useTheme() as DefaultTheme;

  const getCurrentTime = () => {
    const date = new Date();
    return date.toLocaleTimeString([], {
      hourCycle: 'h23',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRemainingTime = () => {
    const date = new Date();
    return date.toLocaleTimeString([], {
      hourCycle: 'h23',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getBackgroundImage = () => {
    if (isHover) {
      if (isExpired) return WalletHoverExpiredIcon;
      if (planType === 'silver') return silverHoverWalletIcon;
      if (isExpiring) return expireHoverWalletIcon;
      return goldHoverWalletIcon;
    }
    if (isExpired) return WalletDefaultExpiredIcon;
    return dashWalletDefaultBgIcon;
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
    if (isHover && isExpired) {
      return 'Expired';
    }
    return ' ';
  };

  const getProgressProps = () => {
    if (isExpiring) {
      if (planType === 'silver') {
        if (isHover) {
          return { value: 40, rotation: 0.01 };
        }
        return { value: 60, rotation: 0.4 };
      }
      if (isHover) {
        return { value: 75, rotation: 0.01 };
      }
      return { value: 25, rotation: 0.75 };
    }
    if (isExpired) {
      if (isHover) {
        return { value: 100, rotation: 0.01 };
      }
      return { value: 0, rotation: 0.75 };
    }
    if (paymentPending) {
      return { value: 0, rotation: 0.75 };
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
    if (isHover && (isExpiring || isExpired)) {
      return theme.palette.warn.main;
    }
    if (planType === 'silver') {
      return theme.palette.background.silver;
    }
    return theme.palette.background.golden;
  };

  return (
    <Container
      isHover={isHover}
      backgroundImage={getBackgroundImage()}
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
      {isNone && (isHover ? <HoverPlusContainer /> : <NoneDefaultPlusImage />)}
      {!isNone && (
        <>
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
                trailColor: theme.palette.background.timer.main,
                rotation: progressProps.rotation,
              })}
            />
            <TimerText isHover={isHover}>
              <TimerHead
                isHover={isHover}
                isExpired={isExpired}
                paymentPending={paymentPending}
              >
                {(() => {
                  if (isHover) {
                    if (paymentPending) {
                      return '05';
                    }
                    return 'Created';
                  }
                  if (isExpired) {
                    return 'Expired on';
                  }
                  if (paymentPending) {
                    return 'Expires in';
                  }
                  return 'Expiry';
                })()}
              </TimerHead>
              <TimerSubtitle
                isHover={isHover}
                isExpiring={isExpiring}
                isExpired={isExpired}
              >
                {(() => {
                  if (paymentPending) {
                    if (isHover) {
                      return getRemainingTime();
                    }
                    return `${getCurrentTime()} Hours`;
                  }
                  return timerDate;
                })()}
              </TimerSubtitle>
            </TimerText>
          </TimerContainer>
          {isExpired && <StyledExpiredPlanIcon />}
          {paymentPending && <StyledExpiredClockIcon />}
          <WalletName
            isHover={isHover}
            isExpiring={isExpiring}
            isExpired={isExpired}
            paymentPending={paymentPending}
          >
            {(() => {
              if (isHover) {
                if (isExpiring || isExpired) {
                  return 'Renew Now';
                }
                if (paymentPending) {
                  return 'Buy Now';
                }
                return name;
              }
              return name;
            })()}
          </WalletName>
        </>
      )}
    </Container>
  );
};
