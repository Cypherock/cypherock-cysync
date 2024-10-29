import { IWallet } from '@cypherock/db-interfaces';

import { ITabs } from '~/hooks';

import {
  IUserDetails,
  WalletAuthLoginStep,
  IOtpVerificationDetails,
} from '../../hooks';

export interface IWalletForSelection extends IWallet {
  isDeleted?: boolean;
  isActive?: boolean;
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
  allWallets: IWalletForSelection[];
  selectedWallet?: IWalletForSelection;
  setSelectedWallet: (wallet: IWalletForSelection) => void;
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
  coupon: string;
  applyCoupon: (coupon: string) => Promise<boolean>;
  isApplyingCoupon: boolean;
  isCouponApplied: boolean;
  activateCoupon: () => Promise<boolean>;
  isActivatingCoupon: boolean;
  isCouponActivated: boolean;
  removeCoupon: () => void;
  applyingCouponError?: { heading: string; subtext: string };
  couponDuration: string;
  isEstablishingSession: boolean;
  isRegisterationRequired: boolean;
  userDetailPrefillData: IUserDetails;
}
