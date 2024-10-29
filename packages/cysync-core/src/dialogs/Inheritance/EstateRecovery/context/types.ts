import { IWallet } from '@cypherock/db-interfaces';

import { ITabs } from '~/hooks';

import { WalletAuthLoginStep, IOtpVerificationDetails } from '../../hooks';

export interface IUserDetails {
  name: string;
  email: string;
  alternateEmail: string;
}

export interface InheritanceEstateRecoveryDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  onClose: () => void;
  onHelp: () => void;
  userDetails?: IUserDetails;
  unhandledError?: any;
  onRetry: () => void;
  retryIndex: number;
  clearErrors: () => void;
  isTermsAccepted: boolean;
  setIsTermsAccepted: (value: boolean) => void;
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
  isRegisterationRequired: boolean;
  fetchEncryptedData: () => Promise<boolean>;
  isFetchingEncryptedData: boolean;
  isEncryptedDataFetched: boolean;
  selectedWallet?: IWallet;
  decryptPinStart: () => void;
  decryptPinAbort: () => void;
  decryptPinDeviceEvents: Record<number, boolean | undefined>;
  decryptPinIsCompleted: boolean;
  decryptedCardLocation?: string;
  decryptedPersonalMessage?: string;
}

export interface InheritanceEstateRecoveryDialogProps {
  walletId: string;
}
