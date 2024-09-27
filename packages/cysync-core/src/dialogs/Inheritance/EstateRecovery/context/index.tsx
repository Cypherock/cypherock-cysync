import { assert } from '@cypherock/cysync-utils';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAsync, useMemoReturn } from '~/hooks';
import { InheritanceLoginTypeMap, inheritancePlanService } from '~/services';
import { useAppSelector } from '~/store';

import {
  InheritanceEstateRecoveryDialogContextInterface,
  InheritanceEstateRecoveryDialogProps,
} from './types';
import {
  tabIndicies,
  useEstateRecoveryDialogHanlders,
} from './useDialogHander';

import { useSession, useWalletAuth, WalletAuthLoginStep } from '../../hooks';

export * from './types';

export const InheritanceEstateRecoveryDialogContext: Context<InheritanceEstateRecoveryDialogContextInterface> =
  createContext<InheritanceEstateRecoveryDialogContextInterface>(
    {} as InheritanceEstateRecoveryDialogContextInterface,
  );

export interface InheritanceEstateRecoveryDialogContextProviderProps
  extends InheritanceEstateRecoveryDialogProps {
  children: ReactNode;
}

export const InheritanceEstateRecoveryDialogProvider: FC<
  InheritanceEstateRecoveryDialogContextProviderProps
> = ({ children, walletId }) => {
  const {
    currentDialog,
    currentTab,
    goTo,
    isDeviceRequired,
    onClose,
    onNext,
    onPrevious,
    tabs,
  } = useEstateRecoveryDialogHanlders();

  const wallets = useAppSelector(state => state.wallet.wallets);
  const selectedWallet = useMemo(
    () => wallets.find(w => w.__id === walletId),
    [walletId, wallets],
  );

  const [unhandledError, setUnhandledError] = useState<any>();
  const [retryIndex, setRetryIndex] = useState(0);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const encryptedMessageRef = useRef<any | undefined>();

  const onError = useCallback((e?: any) => {
    setUnhandledError(e);
  }, []);

  const clearErrors = useCallback(() => {
    setUnhandledError(undefined);
  }, []);

  const walletAuthService = useWalletAuth(onError);
  const sessionService = useSession(onError);

  const walletAuthFetchRequestId = useCallback(() => {
    walletAuthService.fetchRequestId(
      walletId,
      InheritanceLoginTypeMap.nominee,
      'wallet-based',
    );
  }, [walletId, walletAuthService.fetchRequestId]);

  const fetchEncryptedDataHandler = useCallback(async () => {
    let sessionId = await sessionService.getIsActive();

    if (!sessionId) {
      sessionId = await sessionService.start();
    }

    assert(sessionId, 'sessionId not found');
    assert(walletAuthService.authTokens?.accessToken, 'accessToken not found');

    const result = await inheritancePlanService.recover.recover({
      sessionId,
      accessToken: walletAuthService.authTokens.accessToken,
      message: true,
    });

    if (result.error) {
      throw result.error;
    }

    encryptedMessageRef.current = result.result.encryptedMessage;
    return true;
  }, [
    sessionService.start,
    sessionService.getIsActive,
    walletAuthService.authTokens,
  ]);

  const [
    fetchEncryptedData,
    isFetchingEncryptedData,
    isEncryptedDataFetched,
    resetFetchEncryptedData,
  ] = useAsync(fetchEncryptedDataHandler, onError);

  const resetAll = useCallback(() => {
    setRetryIndex(v => v + 1);
    setUnhandledError(undefined);
    walletAuthService.reset();
    sessionService.reset();
    resetFetchEncryptedData();
  }, [walletAuthService.reset, sessionService.reset, resetFetchEncryptedData]);

  const onRetryFuncMap = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(() => ({}), []);

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

  const onNextActionMapPerDialog = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(
    () => ({
      [tabIndicies.wallet.tabNumber]: {
        [tabIndicies.wallet.dialogs.fetchRequestId]: () => {
          if (walletAuthService.currentStep === WalletAuthLoginStep.completed) {
            goTo(
              tabIndicies.wallet.tabNumber,
              tabIndicies.wallet.dialogs.fetchData,
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
  }, [onNext, currentTab, currentDialog]);

  const onPreviousActionMapPerDialog = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(() => ({}), []);

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

  const ctx = useMemoReturn({
    onNext: onNextCallback,
    onPrevious: onPreviousCallback,
    tabs,
    onClose,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
    unhandledError,
    onRetry,
    isTermsAccepted,
    setIsTermsAccepted,
    clearErrors,
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
    isRegisterationRequired: walletAuthService.isRegisterationRequired,
    fetchEncryptedData,
    isFetchingEncryptedData,
    isEncryptedDataFetched,
    selectedWallet,
  });

  return (
    <InheritanceEstateRecoveryDialogContext.Provider value={ctx}>
      {children}
    </InheritanceEstateRecoveryDialogContext.Provider>
  );
};

export function useInheritanceEstateRecoveryDialog(): InheritanceEstateRecoveryDialogContextInterface {
  return useContext(InheritanceEstateRecoveryDialogContext);
}
