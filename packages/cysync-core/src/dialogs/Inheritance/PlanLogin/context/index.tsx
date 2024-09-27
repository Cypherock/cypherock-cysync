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
import { InheritanceLoginTypeMap, inheritancePlanService } from '~/services';
import {
  closeDialog,
  IInheritancePlanDetails,
  updateInheritancePlanDetails,
  useAppDispatch,
} from '~/store';

import {
  InheritancePlanLoginDialogContextInterface,
  InheritancePlanLoginDialogProps,
  tabIndicies,
} from './types';

import { useWalletAuth, WalletAuthLoginStep } from '../../hooks';
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
    walletAuthService.fetchRequestId(
      walletId,
      InheritanceLoginTypeMap.owner,
      'seed-based',
    );
  }, [walletId]);

  const fetchPlanHanlder = useCallback(async () => {
    if (!walletAuthService.authTokens) return false;

    const result = await inheritancePlanService.getPlan({
      accessToken: walletAuthService.authTokens.accessToken,
    });

    if (result.error) {
      throw result.error;
    }

    const activationDate =
      result.result.subscription?.[0]?.activationDate ??
      new Date().toISOString();

    const planDetails: IInheritancePlanDetails = {
      walletId: result.result.wallet,
      name: result.result.fullName ?? '',
      nominee:
        result.result.nominee?.map(n => ({ email: n.email ?? '' })) ?? [],
      executor: result.result.executor?.nominee?.map(n => ({
        email: n.email ?? '',
      }))[0] ?? { email: '' },
      owner: {
        email: result.result.owner?.email ?? '',
        alternateEmail: result.result.owner?.alternateEmail ?? '',
      },
      activationDate: new Date(activationDate).getTime(),
      expiryDate: Date.now() + 2 * 365 * 24 * 60 * 60 * 1000,
    };

    dispatch(
      updateInheritancePlanDetails({
        walletId: planDetails.walletId,
        planDetails,
      }),
    );

    onClose();
    return true;
  }, [walletAuthService.authTokens, onClose]);

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
