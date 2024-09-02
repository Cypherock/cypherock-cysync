import { IWallet } from '@cypherock/db-interfaces';

import { ITabs } from '~/hooks';

import {
  IUserDetails,
  WalletAuthLoginStep,
  IOtpVerificationDetails,
} from '../../hooks';

export interface IWalletWithDeleted extends IWallet {
  isDeleted?: boolean;
}

export interface InheritanceSilverPlanPurchaseDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  onClose: () => void;
  allWallets: IWalletWithDeleted[];
  selectedWallet?: IWalletWithDeleted;
  setSelectedWallet: (wallet: IWalletWithDeleted) => void;
  registerUser: (params: IUserDetails) => void;
  isRegisteringUser: boolean;
  unhandledError?: any;
  onRetry: () => void;
  retryIndex: number;
  clearErrors: () => void;
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
  encryptPinStart: () => void;
  encryptPinAbort: () => void;
  encryptPinDeviceEvents: Record<number, boolean | undefined>;
  encryptPinIsCompleted: boolean;
  setupPlan: () => void;
  isSettingUpPlan: boolean;
  isSetupPlanCompleted: boolean;
  isTermsAccepted: boolean;
  setIsTermsAccepted: (value: boolean) => void;
}
