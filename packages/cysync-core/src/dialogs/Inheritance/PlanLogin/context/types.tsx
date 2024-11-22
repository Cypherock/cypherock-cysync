import { ITabs } from '~/hooks';

import { WalletAuthLoginStep, IOtpVerificationDetails } from '../../hooks';

export interface InheritancePlanLoginDialogProps {
  walletId: string;
  walletName: string;
}

export interface InheritancePlanLoginDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  onClose: () => void;
  unhandledError?: any;
  onRetry: () => void;
  retryIndex: number;
  clearErrors: () => void;
  walletName: string;
  walletAuthDeviceEvents: Record<number, boolean | undefined>;
  walletAuthFetchRequestId: () => void;
  walletAuthIsFetchingRequestId: boolean;
  walletAuthStart: () => void;
  walletAuthAbort: () => void;
  walletAuthIsValidatingSignature: boolean;
  walletAuthValidateSignature: () => Promise<boolean>;
  walletAuthStep: WalletAuthLoginStep;
  otpVerificationDetails?: IOtpVerificationDetails;
  verifyOtp: (otp: string) => Promise<boolean>;
  isVerifyingOtp: boolean;
  fetchPlan: () => void;
  isFetchingPlan: boolean;
}

export const tabIndicies = {
  fetchRequestId: {
    tabNumber: 0,
    dialogs: {
      fetchRequestId: 0,
    },
  },
  walletAuth: {
    tabNumber: 1,
    dialogs: {
      walletAuth: 0,
    },
  },
  validateSignature: {
    tabNumber: 2,
    dialogs: {
      validateSignature: 0,
    },
  },
  verifyEmail: {
    tabNumber: 3,
    dialogs: {
      verifyEmail: 0,
    },
  },
  fetchData: {
    tabNumber: 4,
    dialogs: {
      fetchData: 0,
    },
  },
};
