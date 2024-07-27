import styled from 'styled-components';

import {
  AlertIcon,
  ClockIcon,
  PlusIcon,
  dashWalletDefaultBgIcon,
  dashWalletHoverBgIcon,
} from '../../../assets';
import { WidthProps, width } from '../../utils';

export const NoneDefaultPlusImage = styled(PlusIcon)<{ isHover: boolean }>`
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
  transform: ${({ isHover }) => (isHover ? 'rotate(90deg)' : 'rotate(0)')};
  opacity: ${({ isHover }) => (isHover ? 1 : 0)};
`;

export const HoverPlusContainer = styled.div`
  padding-top: 10px;
`;

export const ProgressbarWrapper = styled.div`
  transition: all 0.9s ease-in-out;
`;

export const Container = styled.div<
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
      ? `url(${isHover ? dashWalletDefaultBgIcon : dashWalletHoverBgIcon})`
      : `url(${backgroundImage})`};
  cursor: pointer;
  position: relative;
  ${width}
`;

export const StyledExpiredPlanIcon = styled(AlertIcon)`
  position: absolute;
  top: 24px;
  right: 10px;
  height: 14px;
  width: 14px;
`;

export const StyledExpiredClockIcon = styled(ClockIcon)`
  position: absolute;
  top: 24px;
  right: 10px;
  height: 14px;
  width: 14px;
  fill: #2a2827;
`;

export const Flex = styled.div<{ isHover: boolean }>`
  display: flex;
  width: 45%;
  ${({ isHover }) =>
    isHover
      ? 'height: unset;padding: 8px 15px;'
      : 'height: unset;padding: 10px 15px;'}
`;

export const Type = styled.div<{ planType: string; isHover: boolean }>`
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
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  ${({ isHover }) =>
    isHover &&
    `
    opacity: 1;
  `}
`;

export const Expiring = styled.div<{ isHover: boolean }>`
  font-family: 'Poppins';
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
  color: ${({ theme }) => theme.palette.error.main};
  position: relative;
  right: 70%;
  transform: ${({ isHover }) =>
    isHover ? 'translateX(0)' : 'translateX(100%)'};
  opacity: ${({ isHover }) => (isHover ? 1 : 0)};
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  transition-delay: 0s;
`;

export const TimerContainer = styled.div<{ isHover: boolean }>`
  display: flex;
  justify-content: center;
  width: 90px;
  height: 90px;
  align-items: center;
  margin-top: ${({ isHover }) => (isHover ? '6px' : '2px')};
`;

export const TimerText = styled.div<{ isHover: boolean; theme: any }>`
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

export const TimerHead = styled.div<{
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

export const getColor = (
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

export const getFontWeight = (isHover: boolean, isExpired: boolean) =>
  isHover || isExpired ? '400' : '700';

export const TimerSubtitle = styled.div<{
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

export const getWalletNameColor = (
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

export const WalletNameContainer = styled.div<{
  isHover: boolean;
  isExpiring: boolean;
  isExpired: boolean;
  paymentPending: boolean;
}>`
  position: relative;
  width: 100%;
  height: 27px;
  overflow: hidden;
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 600;
  line-height: 27px;
  text-align: center;
  margin-top: 12px;
  color: ${({ isHover, isExpiring, isExpired, paymentPending, theme }) =>
    getWalletNameColor(isHover, isExpiring, isExpired, paymentPending, theme)};
`;

export const WalletNameText = styled.div<{
  isHover: boolean;
  disableAnimation?: boolean;
}>`
  position: absolute;
  width: 100%;
  transition: ${({ disableAnimation }) =>
    disableAnimation
      ? 'none'
      : 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'};
  transform: ${({ isHover, disableAnimation }) =>
    isHover && !disableAnimation ? 'translateX(0)' : 'translateX(-15%)'};
  opacity: ${({ isHover, disableAnimation }) =>
    isHover && !disableAnimation ? 1 : 0};
`;

export const WalletNameHoverText = styled(WalletNameText)<{
  isHover: boolean;
  disableAnimation?: boolean;
}>`
  transform: ${({ isHover, disableAnimation }) =>
    isHover && !disableAnimation ? 'translateX(0)' : 'translateX(15%)'};
  opacity: ${({ isHover, disableAnimation }) =>
    isHover && !disableAnimation ? 1 : 0};
`;

export const TransitionTextWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const TransitionText = styled.div<{ isHover: boolean }>`
  position: absolute;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  opacity: ${props => (props.isHover ? 1 : 0)};
  transform: ${props =>
    props.isHover ? 'translateY(0)' : 'translateY(-10px)'};
  width: max-content;
  text-align: center;
  margin-top: 20px;
`;

export const TransitionTextSubtitle = styled.div<{ isHover: boolean }>`
  position: absolute;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  opacity: ${props => (props.isHover ? 1 : 0)};
  transform: ${props =>
    props.isHover ? 'translateY(0)' : 'translateY(-10px)'};
  width: max-content;
  text-align: center;
  margin-bottom: 20px;
`;
