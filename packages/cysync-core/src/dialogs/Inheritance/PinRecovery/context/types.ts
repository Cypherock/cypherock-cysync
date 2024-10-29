import { ITabs } from '~/hooks';

import { WalletAuthLoginStep, IOtpVerificationDetails } from '../../hooks';

export interface IUserDetails {
  name: string;
  email: string;
  alternateEmail: string;
}

export interface InheritancePinRecoveryDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  onHelp: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  unhandledError?: any;
  retryIndex: number;
  selectedWallet?: string;
  userDetails?: IUserDetails;
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
  clearErrors: () => void;
  fetchEncryptedData: () => Promise<boolean>;
  isFetchingEncryptedData: boolean;
  isEncryptedDataFetched: boolean;
  decryptPinStart: () => void;
  decryptPinAbort: () => void;
  decryptPinDeviceEvents: Record<number, boolean | undefined>;
  decryptPinIsCompleted: boolean;
  onRetry: () => void;
}

export const tabIndicies = {
  sync: {
    tabNumber: 0,
    dialogs: {
      fetchRequestId: 0,
      walletAuth: 1,
      validateSignature: 2,
      verifyOtp: 3,
      fetchData: 4,
    },
  },
  decrypt: {
    tabNumber: 1,
    dialogs: {
      decrypt: 0,
    },
  },
  viewPin: {
    tabNumber: 2,
    dialogs: {
      viewPin: 0,
    },
  },
  success: {
    tabNumber: 3,
    dialogs: {
      success: 1,
    },
  },
};
