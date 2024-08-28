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
import { closeDialog, useAppDispatch } from '~/store';

import { InheritancePlanLoginDialogProps } from './types';

import {
  IOtpVerificationDetails,
  useWalletAuth,
  WalletAuthLoginStep,
} from '../../hooks';
import {
  WalletAuth,
  VerifyEmail,
  FetchData,
  FetchRequestId,
  ValidateSignature,
} from '../Dialogs';

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

export const InheritancePlanLoginDialogContext: Context<InheritancePlanLoginDialogContextInterface> =
  createContext<InheritancePlanLoginDialogContextInterface>(
    {} as InheritancePlanLoginDialogContextInterface,
  );

export interface InheritancePlanLoginDialogContextProviderProps
  extends InheritancePlanLoginDialogProps {
  children: ReactNode;
}

const tabIndicies = {
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

export const InheritancePlanLoginDialogProvider: FC<
  InheritancePlanLoginDialogContextProviderProps
> = ({ children, walletId }) => {
  const dispatch = useAppDispatch();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        [tabIndicies.walletAuth.tabNumber]: [
          tabIndicies.walletAuth.dialogs.walletAuth,
        ],
      }),
      [],
    );

  const tabs: ITabs = useMemo(
    () => [
      {
        name: 'Fetch Request Id',
        dialogs: [<FetchRequestId key="Fetch Request Id" />],
      },
      {
        name: 'Wallet Auth',
        dialogs: [<WalletAuth key="Wallet Auth" />],
      },
      {
        name: 'Validate Signature',
        dialogs: [<ValidateSignature key="Validate Signature" />],
      },
      {
        name: 'Verify Email',
        dialogs: [<VerifyEmail key="Verify Email" />],
      },
      {
        name: 'Fetch Data',
        dialogs: [<FetchData key="Fetch Data" />],
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
    dialogName: 'inheritancePlanLogin',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritancePlanLogin'));
  };

  const [unhandledError, setUnhandledError] = useState<any>();
  const [retryIndex, setRetryIndex] = useState(0);

  const onError = useCallback((e?: any) => {
    setUnhandledError(e);
  }, []);

  const clearErrors = useCallback(() => {
    setUnhandledError(undefined);
  }, []);

  const walletAuthService = useWalletAuth(onError);

  const walletAuthFetchRequestId = useCallback(() => {
    walletAuthService.fetchRequestId(walletId);
  }, [walletId]);

  const onRetryFuncMap = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(
    () => ({
      [tabIndicies.fetchRequestId.tabNumber]: {
        [tabIndicies.fetchRequestId.dialogs.fetchRequestId]: () => true,
      },
      [tabIndicies.walletAuth.tabNumber]: {
        [tabIndicies.walletAuth.dialogs.walletAuth]: () => true,
      },
      [tabIndicies.validateSignature.tabNumber]: {
        [tabIndicies.validateSignature.dialogs.validateSignature]: () => true,
      },
    }),
    [],
  );

  const onRetry = useCallback(() => {
    const retryLogic = onRetryFuncMap[currentTab]?.[currentDialog];

    if (retryLogic) {
      setRetryIndex(v => v + 1);
      retryLogic();
    } else {
      setRetryIndex(v => v + 1);
      walletAuthService.reset();
      goTo(0, 0);
    }

    setUnhandledError(undefined);
  }, [currentTab, currentDialog, onRetryFuncMap, walletAuthService.reset]);

  const onNextActionMapPerDialog = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(
    () => ({
      [tabIndicies.fetchRequestId.tabNumber]: {
        [tabIndicies.fetchRequestId.dialogs.fetchRequestId]: () => {
          if (walletAuthService.currentStep === WalletAuthLoginStep.completed) {
            goTo(
              tabIndicies.fetchData.tabNumber,
              tabIndicies.fetchData.dialogs.fetchData,
            );
            return true;
          }

          return false;
        },
      },
    }),
    [walletAuthService.currentStep],
  );

  const onNextCallback = useCallback(() => {
    const action = onNextActionMapPerDialog[currentTab]?.[currentDialog];
    let doNext = true;

    if (action) {
      doNext = !action();
    }

    if (doNext) {
      onNext();
    }
  }, [onNext, currentTab, currentDialog, onNextActionMapPerDialog]);

  const ctx = useMemo(
    () => ({
      onNext: onNextCallback,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
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
      isRegisteringUser: walletAuthService.isRegisteringUser,
      otpVerificationDetails: walletAuthService.otpVerificationDetails,
      verifyOtp: walletAuthService.verifyOtp,
      isVerifyingOtp: walletAuthService.isVerifyingOtp,
    }),
    [
      onNextCallback,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
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
      walletAuthService.isRegisteringUser,
      walletAuthService.otpVerificationDetails,
      walletAuthService.verifyOtp,
      walletAuthService.isVerifyingOtp,
    ],
  );

  return (
    <InheritancePlanLoginDialogContext.Provider value={ctx}>
      {children}
    </InheritancePlanLoginDialogContext.Provider>
  );
};

export function useInheritancePlanLoginDialog(): InheritancePlanLoginDialogContextInterface {
  return useContext(InheritancePlanLoginDialogContext);
}
