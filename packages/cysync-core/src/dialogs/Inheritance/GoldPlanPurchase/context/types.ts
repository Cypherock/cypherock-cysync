import { IWallet } from '@cypherock/db-interfaces';

import { ITabs } from '~/hooks';
import { ReminderPeriod } from '~/services/inheritance/login/schema';

import {
  IUserDetails,
  WalletAuthLoginStep,
  IOtpVerificationDetails,
} from '../../hooks';

export interface IWalletForSelection extends IWallet {
  isDeleted?: boolean;
  isActive?: boolean;
}

export interface InheritanceGoldPlanPurchaseDialogContextInterface {
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
  walletAuthReset: () => void;
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
  onNomineeDetailsSubmit: (params: boolean, index: number) => void;
  onNomineeOtpSubmit: (index: number) => void;
  isSubmittingNomineeDetails: boolean;
  nomineeCount: number;
  setNomineeCount: (nomineeCount: number) => void;
  haveExecutor: boolean;
  setHaveExecutor: (val: boolean) => void;
  onExecutorSelected: () => void;
  isSubmittingExecutorDetails: boolean;
  onExecutorDetailsSubmit: (params: IUserDetails, index: number) => void;
  personalMessage: string;
  setPersonalMessage: (val: string) => void;
  cardLocation: string;
  setCardLocation: (val: string) => void;
  executorMessage: string;
  setExecutorMessage: (val: string) => void;
  nomineeDetails: Record<number, IUserDetails>;
  userDetails?: IUserDetails;
  isEstablishingSession: boolean;
  isRegisterationRequired: boolean;
  reminderPeriod: ReminderPeriod;
  setReminderPeriod: (val: ReminderPeriod) => void;
  isSubmittingReminderDetails: boolean;
  onReminderDetailsSubmit: () => Promise<void>;
  nomineeOtpSubmit: (val: string) => Promise<void>;
  clearNomineeDetails: () => void;
  updateNomineeDetails: (params: IUserDetails, index: number) => void;
  nomineeOtpVerificationDetails?: IOtpVerificationDetails;
  onExecutorMessageSubmit: () => Promise<void>;
  executorDetails?: IUserDetails;
  overriddenCurrentMilestone?: number;
  isOnSummaryPage: boolean;
  setIsOnSummaryPage: (val: boolean) => void;
  executorNomineeIndex?: number;
  fetchExistingDetailsFromServer: () => void;
  userDetailPrefillData: IUserDetails;
}
