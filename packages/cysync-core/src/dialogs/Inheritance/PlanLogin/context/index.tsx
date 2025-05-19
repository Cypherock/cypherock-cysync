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

import { ITabs, useAsync, useMemoReturn, useTabsAndDialogs } from '~/hooks';
import { InheritanceUserTypeMap } from '~/services';
import { closeDialog, useAppDispatch } from '~/store';

import {
  InheritancePlanLoginDialogContextInterface,
  InheritancePlanLoginDialogProps,
  tabIndicies,
} from './types';

import { useWalletAuth, WalletAuthLoginStep } from '../../hooks';
import { useUpdatePlanDetails } from '../../hooks/useUpdatePlanDetails';
import {
  WalletAuth,
  VerifyEmail,
  FetchData,
  FetchRequestId,
  ValidateSignature,
} from '../Dialogs';

export const InheritancePlanLoginDialogContext: Context<InheritancePlanLoginDialogContextInterface> =
  createContext<InheritancePlanLoginDialogContextInterface>(
    {} as InheritancePlanLoginDialogContextInterface,
  );

export interface InheritancePlanLoginDialogContextProviderProps
  extends InheritancePlanLoginDialogProps {
  children: ReactNode;
}

export const InheritancePlanLoginDialogProvider: FC<
  InheritancePlanLoginDialogContextProviderProps
> = ({ children, walletId, walletName }) => {
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
  const authTokenConfig = useMemo(
    () => walletAuthService.authTokenConfig,
    [walletAuthService],
  );

  const walletAuthFetchRequestId = useCallback(() => {
    walletAuthService.fetchRequestId(
      walletId,
      InheritanceUserTypeMap.owner,
      'seed-based',
    );
  }, [walletId]);

  const { fetchAndUpdatePlan } = useUpdatePlanDetails({ authTokenConfig });

  const fetchPlanHanlder = useCallback(async () => {
    if (!authTokenConfig) return false;
    await fetchAndUpdatePlan();
    onClose();
    return true;
  }, [authTokenConfig, onClose]);

  const [fetchPlan, isFetchingPlan] = useAsync(fetchPlanHanlder, onError);

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

  const ctx = useMemoReturn({
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
    walletName,
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
    fetchPlan,
    isFetchingPlan,
  });

  return (
    <InheritancePlanLoginDialogContext.Provider value={ctx}>
      {children}
    </InheritancePlanLoginDialogContext.Provider>
  );
};

export function useInheritancePlanLoginDialog(): InheritancePlanLoginDialogContextInterface {
  return useContext(InheritancePlanLoginDialogContext);
}
