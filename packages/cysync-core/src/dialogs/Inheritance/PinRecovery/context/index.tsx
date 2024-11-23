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

import { openContactSupportDialog } from '~/actions';
import { ITabs, useAsync, useMemoReturn, useTabsAndDialogs } from '~/hooks';
import { InheritanceUserTypeMap, inheritancePlanService } from '~/services';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import {
  InheritancePinRecoveryDialogContextInterface,
  tabIndicies,
} from './types';

import { useDecryptMessage, useSession, useWalletAuth } from '../../hooks';
import {
  ViewPin,
  FetchData,
  SuccessPinRecovery,
  DecryptPin,
  WalletAuth,
  FetchRequestId,
  ValidateSignature,
  VerifyOTP,
} from '../Dialogs';

export * from './types';

export const InheritancePinRecoveryDialogContext: Context<InheritancePinRecoveryDialogContextInterface> =
  createContext<InheritancePinRecoveryDialogContextInterface>(
    {} as InheritancePinRecoveryDialogContextInterface,
  );

export interface InheritancePinRecoveryDialogProps {
  walletId: string;
  walletName: string;
}

export interface InheritancePinRecoveryDialogContextProviderProps
  extends InheritancePinRecoveryDialogProps {
  children: ReactNode;
}

export const InheritancePinRecoveryDialogProvider: FC<
  InheritancePinRecoveryDialogContextProviderProps
> = ({ children, walletId, walletName }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const selectedWallet = walletName;
  const userDetails = undefined;

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        [tabIndicies.sync.tabNumber]: [
          tabIndicies.sync.dialogs.walletAuth,
          tabIndicies.sync.dialogs.fetchData,
        ],
      }),
      [],
    );

  const tabs: ITabs = [
    {
      name: lang.strings.dialogs.inheritancePinRecovery.sync.name,
      dialogs: [
        <FetchRequestId key="Fetch request id" />,
        <WalletAuth key="wallet Auth" />,
        <ValidateSignature key="Validate signature" />,
        <VerifyOTP key="Verify Otp" />,
        <FetchData key="Fetch data" />,
      ],
    },
    {
      name: lang.strings.dialogs.inheritancePinRecovery.decryptPin.name,
      dialogs: [<DecryptPin key="Decrypt pin" />],
    },
    {
      name: lang.strings.dialogs.inheritancePinRecovery.viewPin.name,
      dialogs: [<ViewPin key="View pin" />],
    },
    {
      name: lang.strings.dialogs.inheritancePinRecovery.success.name,
      dialogs: [<SuccessPinRecovery key="Success" />],
      dontShowOnMilestone: true,
    },
  ];

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
    dialogName: 'inheritancePinRecovery',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritancePinRecovery'));
  };

  const onHelp = () => {
    dispatch(openContactSupportDialog());
  };

  const [retryIndex, setRetryIndex] = useState(0);
  const [unhandledError, setUnhandledError] = useState<any>();
  const encryptedMessageRef = useRef<string | undefined>();

  const onError = useCallback((e?: any) => {
    setUnhandledError(e);
  }, []);

  const clearErrors = useCallback(() => {
    setUnhandledError(undefined);
  }, []);

  const walletAuthService = useWalletAuth(onError);
  const decryptMessageService = useDecryptMessage(onError);
  const sessionService = useSession(onError);

  const authTokenConfig = useMemo(
    () => walletAuthService.authTokenConfig,
    [walletAuthService],
  );

  const walletAuthFetchRequestId = useCallback(() => {
    walletAuthService.fetchRequestId(
      walletId,
      InheritanceUserTypeMap.owner,
      'wallet-based',
    );
  }, [selectedWallet, walletAuthService.fetchRequestId]);

  const fetchEncryptedDataHandler = useCallback(async () => {
    let sessionId = await sessionService.getIsActive();

    if (!sessionId) {
      sessionId = await sessionService.start();
    }

    assert(sessionId, 'sessionId not found');
    assert(authTokenConfig, 'accessToken not found');

    const result = await inheritancePlanService.recover.recover({
      sessionId,
      authTokenConfig,
      message: true,
    });

    if (result.error) {
      throw result.error;
    }

    encryptedMessageRef.current = result.result.encryptedMessage;
    return true;
  }, [sessionService.start, sessionService.getIsActive, authTokenConfig]);

  const [
    fetchEncryptedData,
    isFetchingEncryptedData,
    isEncryptedDataFetched,
    resetFetchEncryptedData,
  ] = useAsync(fetchEncryptedDataHandler, onError);

  const startDecryption = useCallback(async () => {
    assert(encryptedMessageRef.current, 'encryptedMessage not found');
    decryptMessageService.start(walletId, encryptedMessageRef.current);
  }, [walletId, decryptMessageService.start]);

  const resetAll = useCallback(() => {
    setRetryIndex(v => v + 1);
    setUnhandledError(undefined);
    encryptedMessageRef.current = undefined;
    walletAuthService.reset();
    sessionService.reset();
    decryptMessageService.reset();
    resetFetchEncryptedData();
  }, [
    walletAuthService.reset,
    decryptMessageService.reset,
    sessionService.reset,
    resetFetchEncryptedData,
  ]);

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
  }, [
    currentTab,
    currentDialog,
    onRetryFuncMap,
    walletAuthService.reset,
    resetAll,
  ]);

  const ctx = useMemoReturn({
    onNext,
    onPrevious,
    tabs,
    onClose,
    onHelp,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
    selectedWallet,
    userDetails,
    walletAuthDeviceEvents: walletAuthService.deviceEvents,
    walletAuthFetchRequestId,
    walletAuthIsFetchingRequestId: walletAuthService.isFetchingRequestId,
    walletAuthStart: walletAuthService.startWalletAuth,
    walletAuthValidateSignature: walletAuthService.validateSignature,
    walletAuthIsValidatingSignature: walletAuthService.isValidatingSignature,
    walletAuthStep: walletAuthService.currentStep,
    walletAuthAbort: walletAuthService.abortWalletAuth,
    otpVerificationDetails: walletAuthService.otpVerificationDetails,
    verifyOtp: walletAuthService.verifyOtp,
    isVerifyingOtp: walletAuthService.isVerifyingOtp,
    onRetry,
    retryIndex,
    unhandledError,
    clearErrors,
    fetchEncryptedData,
    isFetchingEncryptedData,
    isEncryptedDataFetched,
    decryptPinStart: startDecryption,
    decryptPinAbort: decryptMessageService.abort,
    decryptPinDeviceEvents: decryptMessageService.deviceEvents,
    decryptPinIsCompleted: decryptMessageService.isDecrypted,
  });

  return (
    <InheritancePinRecoveryDialogContext.Provider value={ctx}>
      {children}
    </InheritancePinRecoveryDialogContext.Provider>
  );
};

export function useInheritancePinRecoveryDialog(): InheritancePinRecoveryDialogContextInterface {
  return useContext(InheritancePinRecoveryDialogContext);
}
