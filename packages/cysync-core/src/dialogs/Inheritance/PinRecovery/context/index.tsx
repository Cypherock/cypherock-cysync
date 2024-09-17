import { assert } from '@cypherock/cysync-utils';
import { IWallet } from '@cypherock/db-interfaces';
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

import { ITabs, useAsync, useMemoReturn, useTabsAndDialogs } from '~/hooks';
import { InheritanceLoginTypeMap, inheritancePlanService } from '~/services';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import {
  IOtpVerificationDetails,
  useDecryptMessage,
  useSession,
  useWalletAuth,
  WalletAuthLoginStep,
} from '../../hooks';
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

export interface IUserDetails {
  name: string;
  email: string;
  alternateEmail: string;
}

export interface InheritancePinRecoveryDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  unhandledError?: any;
  retryIndex: number;
  selectedWallet?: IWallet;
  userDetails?: IUserDetails;
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
  clearErrors: () => void;
  fetchEncryptedData: () => Promise<boolean>;
  isFetchingEncryptedData: boolean;
  isEncryptedDataFetched: boolean;
  decryptPinStart: () => void;
  decryptPinAbort: () => void;
  decryptPinDeviceEvents: Record<number, boolean | undefined>;
  decryptPinIsCompleted: boolean;
}

export const InheritancePinRecoveryDialogContext: Context<InheritancePinRecoveryDialogContextInterface> =
  createContext<InheritancePinRecoveryDialogContextInterface>(
    {} as InheritancePinRecoveryDialogContextInterface,
  );

export interface InheritancePinRecoveryDialogProps {
  walletId: string;
}

export interface InheritancePinRecoveryDialogContextProviderProps
  extends InheritancePinRecoveryDialogProps {
  children: ReactNode;
}

export const InheritancePinRecoveryDialogProvider: FC<
  InheritancePinRecoveryDialogContextProviderProps
> = ({ children, walletId }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const selectedWallet = undefined;
  const userDetails = undefined;

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        0: [1, 4],
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

  const walletAuthFetchRequestId = useCallback(() => {
    walletAuthService.fetchRequestId(
      walletId,
      InheritanceLoginTypeMap.nominee,
      'wallet-based',
    );
  }, [selectedWallet, walletAuthService.fetchRequestId]);

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
  }, [walletAuthService.reset]);

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

  const ctx = useMemoReturn({
    onNext,
    onPrevious,
    tabs,
    onClose,
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
