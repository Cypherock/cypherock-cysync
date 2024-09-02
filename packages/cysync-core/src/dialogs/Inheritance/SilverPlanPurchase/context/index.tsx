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

import { ITabs, useAsync, useTabsAndDialogs } from '~/hooks';
import { inheritancePlanService } from '~/services';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import {
  InheritanceSilverPlanPurchaseDialogContextInterface,
  IWalletWithDeleted,
} from './types';

import {
  IUserDetails,
  useEncryptMessage,
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

export * from './types';

export const InheritanceSilverPlanPurchaseDialogContext: Context<InheritanceSilverPlanPurchaseDialogContextInterface> =
  createContext<InheritanceSilverPlanPurchaseDialogContextInterface>(
    {} as InheritanceSilverPlanPurchaseDialogContextInterface,
  );

export interface InheritanceSilverPlanPurchaseDialogContextProviderProps {
  children: ReactNode;
}

const tabIndicies = {
  terms: {
    tabNumber: 0,
    dialogs: {
      terms: 0,
      ensure: 1,
    },
  },
  instructions: {
    tabNumber: 1,
    dialogs: {
      instructions: 0,
    },
  },
  selectWallet: {
    tabNumber: 2,
    dialogs: {
      selectWallet: 0,
    },
  },
  walletAuth: {
    tabNumber: 3,
    dialogs: {
      fetchRequestId: 0,
      walletAuth: 1,
      validateSignature: 2,
    },
  },
  email: {
    tabNumber: 4,
    dialogs: {
      userDetails: 0,
      verifyOtp: 1,
    },
  },
  encryption: {
    tabNumber: 5,
    dialogs: {
      deviceEncryption: 0,
      encryptionLoader: 1,
      encryptionSuccess: 2,
    },
  },
};

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

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();
  const [retryIndex, setRetryIndex] = useState(0);
  const [unhandledError, setUnhandledError] = useState<any>();

  const onError = useCallback((e?: any) => {
    setUnhandledError(e);
  }, []);

  const clearErrors = useCallback(() => {
    setUnhandledError(undefined);
  }, []);

  const walletAuthService = useWalletAuth(onError);
  const encryptMessageService = useEncryptMessage(onError);

  const walletAuthFetchRequestId = useCallback(() => {
    if (!selectedWallet?.__id) {
      return;
    }

    walletAuthService.fetchRequestId(selectedWallet.__id);
  }, [selectedWallet, walletAuthService.fetchRequestId]);

  const encryptPinStart = useCallback(() => {
    if (!selectedWallet?.__id) {
      return;
    }

    // TODO: Remove hard coded message when empty encryption is implemented on device
    encryptMessageService.start(selectedWallet.__id, ['Delete me!']);
  }, [selectedWallet, encryptMessageService.start]);

  const onRetryFuncMap = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(
    () => ({
      [tabIndicies.walletAuth.tabNumber]: {
        [tabIndicies.walletAuth.dialogs.fetchRequestId]: () => true,
        [tabIndicies.walletAuth.dialogs.walletAuth]: () => true,
        [tabIndicies.walletAuth.dialogs.validateSignature]: () => true,
      },
      [tabIndicies.encryption.tabNumber]: {
        [tabIndicies.encryption.dialogs.deviceEncryption]: () => true,
        [tabIndicies.encryption.dialogs.encryptionLoader]: () => true,
      },
    }),
    [],
  );

  const setupPlanHandler = useCallback(async () => {
    if (
      !encryptMessageService.encryptedMessages ||
      !walletAuthService.authTokens
    )
      return false;

    const result = await inheritancePlanService.create({
      encryptedData: encryptMessageService.encryptedMessages,
      accessToken: walletAuthService.authTokens.accessToken,
    });

    if (result.error) {
      throw result.error;
    }

    return true;
  }, [
    onError,
    encryptMessageService.encryptedMessages,
    walletAuthService.authTokens,
  ]);

  const [setupPlan, isSettingUpPlan, isSetupPlanCompleted, resetSetupPlan] =
    useAsync(setupPlanHandler, onError);

  const resetAll = useCallback(() => {
    resetSetupPlan();
    setSelectedWallet(undefined);
    setRetryIndex(v => v + 1);
    walletAuthService.reset();
    encryptMessageService.reset();
  }, [walletAuthService.reset, encryptMessageService.reset, resetSetupPlan]);

  const onRetry = useCallback(() => {
    const retryLogic = onRetryFuncMap[currentTab]?.[currentDialog];

    if (retryLogic) {
      setRetryIndex(v => v + 1);
      retryLogic();
    } else {
      resetAll();
      goTo(0, 0);
    }

    setUnhandledError(undefined);
  }, [currentTab, currentDialog, onRetryFuncMap, walletAuthService.reset]);

  const registerUser = useCallback(
    async (params: IUserDetails) => {
      const isSuccess = await walletAuthService.registerUser(params);

      if (isSuccess) {
        goTo(tabIndicies.email.tabNumber, tabIndicies.email.dialogs.verifyOtp);
      }
    },
    [walletAuthService.registerUser],
  );

  const onNextActionMapPerDialog = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(
    () => ({
      [tabIndicies.walletAuth.tabNumber]: {
        [tabIndicies.walletAuth.dialogs.fetchRequestId]: () => {
          if (walletAuthService.currentStep === WalletAuthLoginStep.completed) {
            goTo(
              tabIndicies.encryption.tabNumber,
              tabIndicies.encryption.dialogs.deviceEncryption,
            );
            return true;
          }

          return false;
        },
        [tabIndicies.walletAuth.dialogs.validateSignature]: () => {
          if (!walletAuthService.isRegisterationRequired) {
            goTo(
              tabIndicies.email.tabNumber,
              tabIndicies.email.dialogs.verifyOtp,
            );
            return true;
          }

          return false;
        },
      },
    }),
    [walletAuthService.isRegisterationRequired, walletAuthService.currentStep],
  );

  const fallbackToWalletSelect = useCallback(() => {
    resetSetupPlan();
    setRetryIndex(v => v + 1);
    walletAuthService.reset();
    encryptMessageService.reset();
    goTo(
      tabIndicies.selectWallet.tabNumber,
      tabIndicies.selectWallet.dialogs.selectWallet,
    );
  }, [walletAuthService.reset, encryptMessageService.reset, resetSetupPlan]);

  const onNextCallback = useCallback(() => {
    const action = onNextActionMapPerDialog[currentTab]?.[currentDialog];

    let doNext = true;

    if (action) {
      doNext = !action();
    }

    if (doNext) {
      onNext();
    }
  }, [onNext, currentTab, currentDialog]);

  const onPreviousActionMapPerDialog = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(
    () => ({
      [tabIndicies.email.tabNumber]: {
        [tabIndicies.email.dialogs.userDetails]: () => {
          fallbackToWalletSelect();
          return true;
        },
        [tabIndicies.email.dialogs.verifyOtp]: () => {
          fallbackToWalletSelect();
          return true;
        },
      },
    }),
    [fallbackToWalletSelect],
  );

  const onPreviousCallback = useCallback(() => {
    const action = onPreviousActionMapPerDialog[currentTab]?.[currentDialog];

    let doPrevious = true;

    if (action) {
      doPrevious = !action();
    }

    if (doPrevious) {
      onPrevious();
    }
  }, [onPrevious, currentTab, currentDialog]);

  const ctx = useMemo(
    () => ({
      onNext: onNextCallback,
      onPrevious: onPreviousCallback,
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
      clearErrors,
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
      encryptPinStart,
      encryptPinAbort: encryptMessageService.abort,
      encryptPinDeviceEvents: encryptMessageService.deviceEvents,
      encryptPinIsCompleted: encryptMessageService.isEncrypted,
      setupPlan,
      isSettingUpPlan,
      isSetupPlanCompleted,
      isTermsAccepted,
      setIsTermsAccepted,
    }),
    [
      onNextCallback,
      onPreviousCallback,
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
      clearErrors,
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
      encryptPinStart,
      encryptMessageService.abort,
      encryptMessageService.deviceEvents,
      encryptMessageService.isEncrypted,
      setupPlan,
      isSettingUpPlan,
      isSetupPlanCompleted,
      isTermsAccepted,
      setIsTermsAccepted,
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
