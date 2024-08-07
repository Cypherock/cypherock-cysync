import { IWallet } from '@cypherock/db-interfaces';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import {
  IOtpVerificationDetails,
  IUserDetails,
  useWalletAuth,
  WalletAuthLoginStep,
} from '../../hooks';
import {
  DeviceEncryption,
  EncryptionLoader,
  EncryptionSuccess,
  Ensure,
  FetchRequestId,
  Instructions,
  SelectWallet,
  Terms,
  UserDetails,
  ValidateSignature,
  VerifyOTP,
  WalletAuth,
} from '../Dialogs';

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
}

export const InheritanceSilverPlanPurchaseDialogContext: Context<InheritanceSilverPlanPurchaseDialogContextInterface> =
  createContext<InheritanceSilverPlanPurchaseDialogContextInterface>(
    {} as InheritanceSilverPlanPurchaseDialogContextInterface,
  );

export interface InheritanceSilverPlanPurchaseDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceSilverPlanPurchaseDialogProvider: FC<
  InheritanceSilverPlanPurchaseDialogContextProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        3: [1],
      }),
      [],
    );

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.inheritance.termsOfService.title,
        dialogs: [<Terms key="Terms" />, <Ensure key="Ensure" />],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.instructions.heading,
        dialogs: [<Instructions key="Instructions" />],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.selectWallet.heading,
        dialogs: [<SelectWallet key="Select Wallet" />],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.walletAuth.heading,
        dialogs: [
          <FetchRequestId key="Fetch Request ID" />,
          <WalletAuth key="Wallet Auth" />,
          <ValidateSignature key="Validate Signature" />,
        ],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.email.heading,
        dialogs: [
          <UserDetails key="User Details" />,
          <VerifyOTP key="Verify OTP" />,
        ],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.encryption.heading,
        dialogs: [
          <DeviceEncryption key="Device Encryption" />,
          <EncryptionLoader key="Encryption Loader" />,
          <EncryptionSuccess key="Encryption Success" />,
        ],
      },
    ],
    [],
  );

  const {
    onNext,
    onPrevious,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
  } = useTabsAndDialogs({
    deviceRequiredDialogsMap,
    tabs,
    dialogName: 'inheritanceSilverPlanPurchase',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceSilverPlanPurchase'));
  };

  const wallets = useAppSelector(state => state.wallet.wallets);
  const deletedWallets = useAppSelector(state => state.wallet.deletedWallets);

  const allWallets = useMemo<IWalletWithDeleted[]>(() => {
    const deletedWalletIds = deletedWallets.map(e => e.__id);

    return [
      ...wallets.map(e => ({
        ...e,
        isDeleted: deletedWalletIds.includes(e.__id),
      })),
    ];
  }, [wallets, deletedWallets]);

  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();
  const [retryIndex, setRetryIndex] = useState(0);
  const [unhandledError, setUnhandledError] = useState<any>();

  const onError = useCallback((e?: any) => {
    setUnhandledError(e);
  }, []);

  const walletAuthService = useWalletAuth(onError);

  const walletAuthFetchRequestId = useCallback(() => {
    if (!selectedWallet?.__id) {
      return;
    }

    walletAuthService.fetchRequestId(selectedWallet.__id);
  }, [selectedWallet]);

  const onRetryFuncMap = useMemo<Record<number, { func?: () => void }[]>>(
    () => ({
      3: [{}, {}, {}],
    }),
    [],
  );

  const onRetry = useCallback(() => {
    const retryLogic = onRetryFuncMap[currentTab][currentDialog];

    if (retryLogic) {
      setRetryIndex(v => v + 1);
      if (retryLogic.func) {
        retryLogic.func();
      }
    } else {
      setSelectedWallet(undefined);
      setRetryIndex(v => v + 1);
      walletAuthService.reset();
      goTo(0, 0);
    }

    setUnhandledError(undefined);
  }, [currentTab, currentDialog, onRetryFuncMap, walletAuthService.reset]);

  const registerUser = useCallback(
    async (params: IUserDetails) => {
      const isSuccess = await walletAuthService.registerUser(params);

      if (isSuccess) {
        goTo(4, 1);
      }
    },
    [walletAuthService.registerUser],
  );

  const ctx = useMemo(
    () => ({
      onNext,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
      allWallets,
      selectedWallet,
      setSelectedWallet,
      registerUser,
      unhandledError,
      onRetry,
      retryIndex,
      walletAuthDeviceEvents: walletAuthService.deviceEvents,
      walletAuthFetchRequestId,
      walletAuthIsFetchingRequestId: walletAuthService.isFetchingRequestId,
      walletAuthStart: walletAuthService.startWalletAuth,
      walletAuthValidateSignature: walletAuthService.validateSignature,
      walletAuthIsValidatingSignature: walletAuthService.isValidatingSignature,
      walletAuthStep: walletAuthService.currentStep,
      walletAuthAbort: walletAuthService.abortWalletAuth,
      onRegister: walletAuthService.registerUser,
      isRegisteringUser: walletAuthService.isRegisteringUser,
      otpVerificationDetails: walletAuthService.otpVerificationDetails,
      verifyOtp: walletAuthService.verifyOtp,
      isVerifyingOtp: walletAuthService.isVerifyingOtp,
    }),
    [
      onNext,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
      allWallets,
      selectedWallet,
      setSelectedWallet,
      registerUser,
      unhandledError,
      onRetry,
      retryIndex,
      walletAuthService.deviceEvents,
      walletAuthFetchRequestId,
      walletAuthService.isFetchingRequestId,
      walletAuthService.startWalletAuth,
      walletAuthService.isValidatingSignature,
      walletAuthService.currentStep,
      walletAuthService.abortWalletAuth,
      walletAuthService.registerUser,
      walletAuthService.isRegisteringUser,
      walletAuthService.otpVerificationDetails,
      walletAuthService.verifyOtp,
      walletAuthService.isVerifyingOtp,
    ],
  );

  return (
    <InheritanceSilverPlanPurchaseDialogContext.Provider value={ctx}>
      {children}
    </InheritanceSilverPlanPurchaseDialogContext.Provider>
  );
};

export function useInheritanceSilverPlanPurchaseDialog(): InheritanceSilverPlanPurchaseDialogContextInterface {
  return useContext(InheritanceSilverPlanPurchaseDialogContext);
}
