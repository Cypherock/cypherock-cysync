import styled from 'styled-components';

import {
  AlertIcon,
  ClockIcon,
  PlusIcon,
  dashWalletDefaultBgIcon,
  dashWalletHoverBgIcon,
} from '../../../assets';
import { WidthProps, width } from '../../utils';

export const SetupCoverContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  transform: translateY(10px);
`;

export const SetupCoverPlusImage = styled(PlusIcon)<{ isHover: boolean }>`
  transition: transform 0.3s ease-in-out, margin-bottom 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
  width: 34px;
  height: 34px;
  transform: ${({ isHover }) =>
    isHover ? 'rotate(-90deg) scale(2)' : 'rotate(0) scale(1)'};
  margin-bottom: ${({ isHover }) => (isHover ? '-10px' : '16px')};
  opacity: ${({ isHover }) => (isHover ? '1' : '0.4')};
`;

export const SetupCoverText = styled.div<{ isHover: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins';
  font-size: 12px;
  color: white;
  transition: transform 0.3s ease-in-out;
  transform: ${({ isHover }) =>
    isHover ? 'translateY(500%) translateX(10%)' : 'translateY(0)'};
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
  text-align: center;
  color: white;
  background: ${({ isHover, isNone, backgroundImage }) =>
    isNone
      ? `url(${isHover ? dashWalletDefaultBgIcon : dashWalletHoverBgIcon})`
      : `url(${backgroundImage})`};
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
  height: unset;
  padding: 8px 15px;
  fill: #2a2827;
`;

export const Type = styled.div<{ type: string; isHover: boolean }>`
  font-family: 'Poppins';
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  text-transform: uppercase;
  background: ${({ type, theme }) =>
    type === 'silver'
      ? theme.palette.background.secondary
      : theme.palette.text.gold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  right: 95%;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  ${({ isHover }) =>
    isHover &&
    `
    opacity: 1;
  `}
`;

export const Expiring = styled.div<{
  isHover: boolean;
  disableTransform: boolean;
}>`
  font-family: 'Poppins';
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  text-align: left;
  color: ${({ theme }) => theme.palette.error.main};
  position: relative;
  right: 70%;
  transform: ${({ isHover, disableTransform }) => {
    if (disableTransform) return 'none';
    return isHover ? 'translateX(0)' : 'translateX(40%)';
  }};
  opacity: ${({ isHover }) => (isHover ? 1 : 0)};
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
`;

export const TimerContainer = styled.div<{ isHover: boolean }>`
  display: flex;
  justify-content: center;
  width: 90px;
  height: 90px;
  align-items: center;
  margin-top: 2px;
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
  font-size: 10px;
  font-weight: ${({ isHover, isExpired, paymentPending }) => {
    if (isExpired || isHover || paymentPending) {
      return '700';
    }
    return '400';
  }};
  line-height: 16.5px;
  text-align: left;
  color: ${({ isExpired, isHover, theme, paymentPending }) => {
    if (isExpired) {
      return theme.palette.warn.main;
    }
    if (isHover || paymentPending) {
      return 'white';
    }
    return theme.palette.muted.main;
  }};
`;

export const getColor = (
  isExpiring: boolean,
  isHover: boolean,
  isExpired: boolean,
  paymentPending: boolean,
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
  if (isExpired || paymentPending) {
    return theme.palette.muted.main;
  }
  return 'white';
};

export const getFontWeight = (
  isHover: boolean,
  isExpired: boolean,
  paymentPending: boolean,
) => (isHover || isExpired || paymentPending ? '400' : '700');

export const TimerSubtitle = styled.div<{
  isHover: boolean;
  isExpiring: boolean;
  isExpired: boolean;
  paymentPending: boolean;
}>`
  font-family: 'Poppins';
  font-size: 10px;
  font-weight: ${({ isHover, isExpired, paymentPending }) =>
    getFontWeight(isHover, isExpired, paymentPending)};
  line-height: 18px;
  text-align: left;
  text-transform: uppercase;
  color: ${({ isExpiring, isHover, isExpired, paymentPending, theme }) =>
    getColor(isExpiring, isHover, isExpired, paymentPending, theme)};
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
  height: 21px;
  overflow: hidden;
  font-family: 'Poppins';
  font-size: 14px;
  font-weight: 600;
  line-height: 21px;
  text-align: center;
  margin-top: 8px;
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
    isHover && !disableAnimation ? 'translateX(0)' : 'translateX(15%)'};
  opacity: ${({ isHover, disableAnimation }) =>
    isHover && !disableAnimation ? 1 : 0};
`;

export const WalletNameHoverText = styled(WalletNameText)<{
  isHover: boolean;
  disableAnimation?: boolean;
}>`
  transform: ${({ isHover, disableAnimation }) =>
    isHover && !disableAnimation ? 'translateX(0)' : 'translateX(-15%)'};
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
    props.isHover
      ? 'translateY(0px) translateX(0px)'
      : 'translateY(1px) translateX(-1px)'};
  width: max-content;
  text-align: center;
  margin-top: 20px;
`;

export const TransitionTextSubtitle = styled.div<{ isHover: boolean }>`
  position: absolute;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  opacity: ${props => (props.isHover ? 1 : 0)};
  transform: ${props =>
    props.isHover
      ? 'translateY(0px) translateX(0px)'
      : 'translateY(1px) translateX(-1px)'};
  width: max-content;
  text-align: center;
  margin-bottom: 20px;
`;
