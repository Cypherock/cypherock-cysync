import { DefaultTheme } from 'styled-components/dist/types';

import {
  WalletHoverExpiredIcon,
  WalletHoverSilverBgIcon,
  expireHoverWalletIcon,
  goldHoverWalletIcon,
  WalletDefaultExpiredIcon,
  dashWalletDefaultBgIcon,
} from '../../../assets';

export const calculateProgress = (
  startDate: string,
  expiryDate: string,
  status: 'Active' | 'Inactive' | 'Pending',
) => {
  const start = new Date(startDate);
  const expiry = new Date(expiryDate);
  const now = new Date();

  const totalDuration = expiry.getTime() - start.getTime();
  const elapsedDuration = now.getTime() - start.getTime();

  let value = (elapsedDuration / totalDuration) * 100;
  let rotation = 1 - elapsedDuration / totalDuration;

  if (status === 'Pending') {
    value = 0;
    rotation = 0;
  }

  return {
    value: value > 100 ? 100 : value,
    rotation: rotation > 1 ? 1 : rotation,
  };
};

export const getCurrentTime = () => {
  const date = new Date();
  return date.toLocaleTimeString([], {
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getCurrentFullTime = () => {
  const date = new Date();
  return date.toLocaleTimeString([], {
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const getBackgroundImage = (
  isHover: boolean,
  isExpired: boolean,
  planType: string,
  isExpiring: boolean,
) => {
  if (isHover) {
    if (isExpired) return WalletHoverExpiredIcon;
    if (planType === 'silver') return WalletHoverSilverBgIcon;
    if (isExpiring) return expireHoverWalletIcon;
    return goldHoverWalletIcon;
  }
  if (isExpired) return WalletDefaultExpiredIcon;
  return dashWalletDefaultBgIcon;
};

export const getTypeText = (planType: string, lang: any) =>
  planType === 'silver'
    ? lang.dashboard.wallet.silver
    : lang.dashboard.wallet.gold;

export const getExpiringText = (
  isHover: boolean,
  isExpired: boolean,
  isExpiring: boolean,
  lang: any,
): string => {
  if (isHover && (isExpiring || isExpired)) {
    if (isExpiring) {
      return lang.dashboard.wallet.expiring;
    }
    if (isExpired) {
      return lang.dashboard.wallet.expired;
    }
  }
  return '';
};

export const getPathColor = (
  isHover: boolean,
  isExpiring: boolean,
  isExpired: boolean,
  theme: DefaultTheme,
  planType: string,
) => {
  if (isHover && (isExpiring || isExpired)) {
    return theme.palette.warn.main;
  }
  if (planType === 'silver') {
    return theme.palette.background.silver;
  }
  return theme.palette.background.golden;
};

export const calculateDiffDays = (expiryDate: string) => {
  const diffTime = Math.abs(
    new Date(expiryDate).getTime() - new Date().getTime(),
  );
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getTimerHeadText = (
  isHover: boolean,
  isExpired: boolean,
  paymentPending: boolean,
  expiryDate: string,
  lang: any,
) => {
  if (isHover) {
    if (paymentPending) {
      return `${calculateDiffDays(expiryDate)}`;
    }
    return lang.dashboard.wallet.created;
  }
  if (isExpired) {
    return lang.dashboard.wallet.expiredOn;
  }
  if (paymentPending) {
    return lang.dashboard.wallet.expiresIn;
  }
  return lang.dashboard.wallet.expiry;
};

export const calculateHoverText = (
  isExpiring: boolean,
  isExpired: boolean,
  paymentPending: boolean,
  name: string,
  lang: { dashboard: any },
) => {
  if (isExpiring || isExpired) {
    return lang.dashboard.wallet.renewNow;
  }
  if (paymentPending) {
    return lang.dashboard.wallet.buyNow;
  }
  return name;
};

export const updateProgressAndHover = (
  startDate: string,
  expiryDate: string,
  status: 'Active' | 'Inactive' | 'Pending',
  isExpired: any,
  paymentPending: any,
  setProgress: (arg0: { value: number; rotation: number }) => void,
  setHoverProgress: (arg0: { value: number; rotation: number }) => void,
) => {
  let value = 0;
  let rotation = 0;
  let hoverValue = 100;

  if (isExpired) {
    value = 0;
    hoverValue = 100;
    rotation = 0;
  } else if (paymentPending) {
    value = 0;
    hoverValue = 0;
    rotation = 0;
  } else {
    const progressData = calculateProgress(startDate, expiryDate, status);
    value = progressData.value;
    rotation = progressData.rotation;
    hoverValue = 100 - value;
  }

  setProgress({ value, rotation });
  setHoverProgress({ value: hoverValue, rotation });
};

export const updateHoverOnly = (
  startDate: string,
  expiryDate: string,
  status: 'Active' | 'Inactive' | 'Pending',
  setProgress: (arg0: { value: number; rotation: number }) => void,
  setHoverProgress: (arg0: { value: number; rotation: number }) => void,
) => {
  const { value, rotation } = calculateProgress(startDate, expiryDate, status);
  const hoverValue = 100 - value;
  const hoverRotation = 1;
  setProgress({ value, rotation });
  setHoverProgress({ value: hoverValue, rotation: hoverRotation });
};
