import {
  WalletHoverExpiredIcon,
  WalletHoverSilverBgIcon,
  goldHoverWalletIcon,
  WalletDefaultExpiredIcon,
  WalletDefaultPendingIcon,
  dashWalletDefaultBgIcon,
  WalletHoverPendingIcon,
} from '../../../assets';
import { ThemeType } from '../../../themes';
import { svgGradients } from '../../GlobalStyles';

export const getBackgroundImage = (
  isHover: boolean,
  isExpired: boolean,
  type: string,
  isExpiring: boolean,
  paymentPending: boolean,
) => {
  if (isHover) {
    if (isExpired || isExpiring) return WalletHoverExpiredIcon;
    if (type === 'silver') return WalletHoverSilverBgIcon;
    if (paymentPending) return WalletHoverPendingIcon;
    return goldHoverWalletIcon;
  }
  if (paymentPending) return WalletDefaultPendingIcon;
  if (isExpired) return WalletDefaultExpiredIcon;
  return dashWalletDefaultBgIcon;
};

export const getTypeText = (type: string, lang: any) =>
  type === 'silver' ? lang.dashboard.wallet.silver : lang.dashboard.wallet.gold;

export const getExpiringText = (
  isExpiring: boolean,
  isExpired: boolean,
  lang: any,
): string => {
  if (isExpiring && !isExpired) {
    return lang.dashboard.wallet.expiring;
  }
  if (isExpired) {
    return lang.dashboard.wallet.expired;
  }
  return '';
};

export const getPathColor = (
  isHover: boolean,
  isExpiring: boolean,
  isExpired: boolean,
  isPaymentPending: boolean,
  theme: ThemeType,
  type: string,
) => {
  if (isHover && (isExpiring || isExpired)) {
    return theme.palette.warn.main;
  }
  if (isPaymentPending) {
    return theme.palette.text.warn;
  }
  if (type === 'silver' && !isPaymentPending) {
    return `url(#${svgGradients.silver})`;
  }
  return `url(#${svgGradients.gold})`;
};

export const getTimerHeadText = (
  isHover: boolean,
  isExpired: boolean,
  paymentPending: boolean,
  lang: any,
) => {
  if (isHover) {
    return lang.dashboard.wallet.created;
  }
  if (paymentPending) {
    return lang.dashboard.wallet.pending;
  }
  if (isExpired) {
    return lang.dashboard.wallet.expiredOn;
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

export const updateProgressAndHover = (params: {
  startDate: number;
  expiryDate: number;
  isExpired: boolean;
  isPaymentPending: boolean;
  setProgress: (params: { value: number; rotation: number }) => void;
  setHoverProgress: (params: { value: number; rotation: number }) => void;
}) => {
  const {
    startDate,
    expiryDate,
    isExpired,
    isPaymentPending,
    setProgress,
    setHoverProgress,
  } = params;
  let value = 0;
  let rotation = 0;
  let hoverValue = 0;
  let hoverRotation = 0;

  if (isExpired) {
    value = 0;
    rotation = 0;

    hoverValue = 100;
    hoverRotation = 0;
  } else if (isPaymentPending) {
    value = 0;
    rotation = 0;

    hoverValue = 100;
    hoverRotation = 0;
  } else {
    const now = Date.now();

    const totalDuration = expiryDate - startDate;
    const elapsedDuration = now - startDate;
    const timeRemaining = expiryDate - now;

    hoverValue = (elapsedDuration / totalDuration) * 100;
    hoverRotation = 0;

    value = (timeRemaining / totalDuration) * 100;
    rotation = hoverValue / 100;

    value = Math.min(100, value);
    hoverValue = Math.min(100, hoverValue);

    rotation = Math.min(1, rotation);
    hoverRotation = Math.min(1, hoverRotation);
  }

  setProgress({ value, rotation });
  setHoverProgress({ value: hoverValue, rotation: hoverRotation });
};
