// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import {
  ICreateAccountEvent,
  ICreatedAccount,
} from '@cypherock/coin-support-interfaces';
import { insertAccountIfNotExists } from '@cypherock/coin-support-utils';
import { ICoinInfo, coinFamiliesMap, coinList } from '@cypherock/coins';
import { ServerErrorType } from '@cypherock/cysync-core-constants';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Observer, Subscription } from 'rxjs';

import {
  openCreateCantonAccountDialog,
  syncAccounts,
  syncPriceHistories,
  syncPrices,
} from '~/actions';
import { setCantonAccountAuthTokens } from '~/actions/canton';
import { deviceLock, useCurrency, useDevice } from '~/context';
import { ITabs, useMemoReturn, useTabsAndDialogs } from '~/hooks';
import { useWalletDropdown } from '~/hooks/useWalletDropdown';
import { cantonService } from '~/services/canton';
import {
  closeDialog,
  ICantonAuthTokens,
  selectCantonAuthTokens,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB, getKeyDB } from '~/utils';
import logger from '~/utils/logger';

import {
  AddAccountCongrats,
  AddAccountDeviceActionDialog,
  AddAccountSelectionDialog,
  AddAccountSyncDialog,
  UserDetails,
  VerifyOTP,
  SuccessDialog,
  LoaderDialog,
} from '../Dialogs';

export type AddAccountStatus = 'idle' | 'device' | 'sync' | 'done';

const selector = createSelector(
  [selectLanguage, selectCantonAuthTokens],
  (lang, cantonAuthTokens) => ({ lang, cantonAuthTokens }),
);

export interface AddAccountDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  onSelectionDialogNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  selectedCoin: ICoinInfo | undefined;
  selectedWallet: IWallet | undefined;
  selectedAccounts: IAccount[];
  newSelectedAccounts: IAccount[];
  setSelectedCoin: React.Dispatch<React.SetStateAction<ICoinInfo | undefined>>;
  setSelectedWallet: React.Dispatch<React.SetStateAction<IWallet | undefined>>;
  setSelectedAccounts: React.Dispatch<React.SetStateAction<IAccount[]>>;
  setNewSelectedAccounts: React.Dispatch<React.SetStateAction<IAccount[]>>;
  startAddAccounts: () => void;
  addSelectedAccounts: () => void;
  createNewSelectedAccounts: () => void;
  isStopped: boolean;
  onStop: () => void;
  onRetry: () => void;
  newAccounts: IAccount[];
  accounts: IAccount[];
  deviceEvents: Record<number, boolean | undefined>;
  addAccountStatus: AddAccountStatus;
  error: any | undefined;
  walletDropdownList: DropDownItemProps[];
  handleWalletChange: (id?: string) => void;
  defaultWalletId?: string;
  onUserDetailsSubmit: () => void;
  isSubmittingUserDetails: boolean;
  email: string;
  setEmail: (email: string) => void;
  setHasErrors: (hasErrors: boolean) => void;
  onOTPSubmit: (otp: string) => void;
  isSubmittingOTP: boolean;
  otpVerificationDetails: ICantonOtpVerificationDetails | undefined;
  cantonAuthTokens: ICantonAuthTokens | undefined;
  isUserEligibleForCanton: boolean;
  isUserInWaitingListForCanton: boolean;
}

export const AddAccountDialogContext: Context<AddAccountDialogContextInterface> =
  createContext<AddAccountDialogContextInterface>(
    {} as AddAccountDialogContextInterface,
  );

export interface AddAccountDialogContextProviderProps {
  children: ReactNode;
  walletId?: string;
  coinId?: string;
}

export interface ICantonOtpVerificationDetails {
  email: string;
  retriesRemaining: number;
  otpExpiry: string;
  showIncorrectError?: boolean;
}

export const AddAccountDialogProvider: FC<
  AddAccountDialogContextProviderProps
> = ({ children, walletId: defaultWalletId, coinId: defaultCoinId }) => {
  const { lang, cantonAuthTokens } = useAppSelector(selector);
  const dispatch = useAppDispatch();
  const { connection } = useDevice();

  const {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
  } = useWalletDropdown({ walletId: defaultWalletId });
  const [selectedCoin, setSelectedCoin] = useState<ICoinInfo | undefined>(
    defaultCoinId ? coinList[defaultCoinId] : undefined,
  );
  const [selectedAccounts, setSelectedAccounts] = useState<IAccount[]>([]);
  const [newSelectedAccounts, setNewSelectedAccounts] = useState<IAccount[]>(
    [],
  );

  const [isStopped, setIsStopped] = useState(false);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [newAccounts, setNewAccounts] = useState<IAccount[]>([]);
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});

  const [addAccountStatus, setAddAccountStatus] =
    useState<AddAccountStatus>('idle');
  const [error, setError] = useState<any | undefined>();

  const addAccountSubscriptionRef = useRef<Subscription | undefined>();

  const { currentCurrency } = useCurrency();

  // canton signup/login states
  const [isSubmittingUserDetails, setIsSubmittingUserDetails] = useState(false);
  const [email, setEmail] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isSubmittingOTP, setIsSubmittingOTP] = useState(false);
  const [otpVerificationDetails, setOtpVerificationDetails] = useState<
    ICantonOtpVerificationDetails | undefined
  >();
  const [isUserEligibleForCanton, setIsUserEligibleForCanton] = useState(false);
  const [isUserInWaitingListForCanton, setIsUserInWaitingListForCanton] =
    useState(true);
  const [otpVerified, setOtpVerified] = useState(false);

  const resetOtpVerificationStates = () => {
    setIsSubmittingUserDetails(false);
    setIsSubmittingOTP(false);
    setOtpVerificationDetails(undefined);
    setIsUserEligibleForCanton(false);
    setIsUserInWaitingListForCanton(true);
    setOtpVerified(false);
  };

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        1: [0],
      }),
      [],
    );

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.addAccount.aside.tabs.asset,
        dialogs: [<AddAccountSelectionDialog />],
      },
      {
        name: lang.strings.addAccount.aside.tabs.device,
        dialogs: [
          <UserDetails />,
          <VerifyOTP />,
          <LoaderDialog />,
          <SuccessDialog />,
          <AddAccountDeviceActionDialog />,
        ],
      },
      {
        name: lang.strings.addAccount.aside.tabs.confirmation,
        dialogs: [<AddAccountSyncDialog />],
      },
      {
        name: '',
        dialogs: [<AddAccountCongrats />],
        dontShowOnMilestone: true,
      },
    ],
    [lang],
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
    dialogName: 'addAccount',
  });

  const resetAddAccountStates = () => {
    setAddAccountStatus('idle');
    setNewAccounts([]);
    setIsStopped(false);
    setAccounts([]);
    setNewSelectedAccounts([]);
    setSelectedAccounts([]);
    setDeviceEvents({});
    setError(undefined);
  };

  const cleanUpAddAccount = () => {
    if (addAccountSubscriptionRef.current) {
      addAccountSubscriptionRef.current.unsubscribe();
      addAccountSubscriptionRef.current = undefined;
    }
  };

  const onClose = () => {
    setAddAccountStatus('idle');
    cleanUpAddAccount();
    dispatch(closeDialog('addAccount'));
  };

  const onError = (e?: any) => {
    cleanUpAddAccount();
    setError(e);
  };

  const onSelectionDialogNext = useCallback(() => {
    if (selectedCoin?.family === coinFamiliesMap.canton) {
      onNext();
    } else {
      goTo(1, 4);
    }
  }, [onNext, goTo, selectedCoin]);

  const onOtpVerificationSuccess = useCallback(
    (isEligible: boolean, isInWaitingList: boolean) => {
      setIsUserEligibleForCanton(isEligible);
      setIsUserInWaitingListForCanton(isInWaitingList);
      setOtpVerified(true);
      setOtpVerificationDetails(undefined);
      setIsSubmittingOTP(false);
      onNext();
    },
    [
      onNext,
      setIsUserEligibleForCanton,
      setIsUserInWaitingListForCanton,
      setOtpVerified,
      setOtpVerificationDetails,
      setIsSubmittingOTP,
    ],
  );

  const onOtpVerificationFailure = useCallback(
    (otpExpiry: string, retriesRemaining: number) => {
      setOtpVerificationDetails({
        email,
        showIncorrectError: true,
        otpExpiry,
        retriesRemaining,
      });
      setOtpVerified(false);
      setIsSubmittingOTP(false);
    },
    [email, setOtpVerificationDetails, setOtpVerified, setIsSubmittingOTP],
  );

  const onUserDetailsSubmit = useCallback(async () => {
    if (hasErrors) return;
    setIsSubmittingUserDetails(true);

    const response = await cantonService.login({ email });

    if (response.error) {
      setIsSubmittingUserDetails(false);
      throw response.error;
    }

    setOtpVerificationDetails({
      email,
      retriesRemaining: response.result.otpDetails.retriesRemaining,
      otpExpiry: response.result.otpDetails.otpExpiry,
    });

    setIsSubmittingUserDetails(false);
    onNext();
  }, [onNext, email, hasErrors, setIsSubmittingUserDetails]);

  const onOTPSubmit = useCallback(
    async (otp: string) => {
      setIsSubmittingOTP(true);
      const response = await cantonService.loginOtpVerification({
        email,
        secret: otp,
      });

      if (response.error) {
        if (response.error.code === ServerErrorType.OTP_VERIFICATION_FAILED) {
          onOtpVerificationFailure(
            response.error.details?.responseBody.otpExpiry ??
              otpVerificationDetails?.otpExpiry,
            response.error.details?.responseBody.retriesRemaining ??
              otpVerificationDetails?.retriesRemaining,
          );
          setIsSubmittingOTP(false);
        } else if (
          response.error.code ===
          ServerErrorType.MAX_DAILY_USER_REGISTRATIONS_EXCEEDED
        ) {
          onOtpVerificationSuccess(true, true);
        } else if (
          response.error.code ===
          ServerErrorType.USER_NOT_ELIGIBLE_FOR_PARTY_CREATION
        ) {
          onOtpVerificationSuccess(false, false);
        } else {
          // treating all other errors as OTP expired error for now
          onOtpVerificationFailure(
            response.error.details?.responseBody.otpExpiry ??
              otpVerificationDetails?.otpExpiry,
            0,
          );
          throw response.error;
        }
        return;
      }

      dispatch(
        setCantonAccountAuthTokens({
          accessToken: response.result.accessToken,
          refreshToken: response.result.refreshToken,
        }),
      );
      onOtpVerificationSuccess(true, false);
    },
    [
      onOtpVerificationSuccess,
      email,
      setIsSubmittingOTP,
      otpVerificationDetails,
    ],
  );

  const createAccountSetter =
    (account: ICreatedAccount) => (list: IAccount[]) =>
      [...list, { ...account, isNew: undefined }];

  const getAddAccountObserver = (
    onEnd: () => void,
  ): Observer<ICreateAccountEvent> => ({
    next: payload => {
      if (payload.device) {
        setDeviceEvents({ ...payload.device.events });
        if (payload.device.isDone) {
          setAddAccountStatus('sync');
        }
      }

      if (payload.account) {
        if (payload.account.isNew) {
          setNewAccounts(createAccountSetter(payload.account));
        } else {
          setAccounts(createAccountSetter(payload.account));
        }
      }
    },
    error: err => {
      onEnd();
      onError(err);
      setAddAccountStatus('idle');
    },
    complete: () => {
      onEnd();
      setAddAccountStatus('done');
      cleanUpAddAccount();
    },
  });

  const startAddAccounts = async () => {
    logger.info('Started add account');

    if (!connection?.connection || !selectedCoin || !selectedWallet) {
      return;
    }

    resetAddAccountStates();
    cleanUpAddAccount();
    const coinSupport = getCoinSupport(selectedCoin.family);

    setAddAccountStatus('device');

    const taskId = lodash.uniqueId('task-');

    await deviceLock.acquire(connection.device, taskId);

    const onEnd = () => {
      deviceLock.release(connection.device, taskId);
    };

    const deviceConnection = connection.connection;
    const subscription = coinSupport
      .createAccounts({
        walletId: selectedWallet.__id ?? '',
        connection: deviceConnection,
        db: getDB(),
        coinId: selectedCoin.id,
        keyDB: getKeyDB(),
      })
      .subscribe(getAddAccountObserver(onEnd));

    addAccountSubscriptionRef.current = subscription;
  };

  const onStop = () => {
    setIsStopped(true);
    setAddAccountStatus('done');
    cleanUpAddAccount();
  };

  const onRetry = () => {
    resetAddAccountStates();
    if (selectedCoin?.family === coinFamiliesMap.canton && !otpVerified) {
      resetOtpVerificationStates();
      goTo(1, 0);
    } else {
      goTo(1, 4);
    }
  };

  const addSelectedAccounts = async () => {
    const allAccountsToAdd = [...selectedAccounts, ...newSelectedAccounts];
    if (allAccountsToAdd.length === 0) {
      return;
    }

    try {
      const db = getDB();
      const addedAccounts: IAccount[] = [];

      for (let i = 0; i < allAccountsToAdd.length; i += 1) {
        const account = allAccountsToAdd[i];
        const response = await insertAccountIfNotExists(db, account);
        if (response.isInserted) addedAccounts.push(response.account);
      }

      dispatch(
        syncAccounts({ accounts: addedAccounts, currency: currentCurrency }),
      );
      if (selectedCoin) {
        syncPrices({
          families: [selectedCoin.family],
          currency: currentCurrency,
        });
        syncPriceHistories({
          families: [selectedCoin.family],
          currency: currentCurrency,
        });
      }
      goTo(3, 0);
    } catch (e) {
      onError(e);
    }
  };

  const createNewSelectedAccounts = async () => {
    onClose();
    if (newSelectedAccounts.length > 0) {
      // For Canton, we only create one account per wallet.
      dispatch(
        openCreateCantonAccountDialog({
          selectedAccount: newSelectedAccounts[0],
          selectedWallet,
        }),
      );
    }
  };

  useEffect(() => {
    if (!connection) {
      if (addAccountStatus === 'device') {
        setAddAccountStatus('idle');
        resetAddAccountStates();
        cleanUpAddAccount();
      }
    }
  }, [connection]);

  useEffect(
    () => () => {
      cleanUpAddAccount();
    },
    [],
  );

  const ctx = useMemoReturn({
    defaultWalletId,
    isDeviceRequired,
    currentTab,
    currentDialog,
    tabs,
    onNext,
    onSelectionDialogNext,
    goTo,
    onPrevious,
    onClose,
    selectedCoin,
    selectedWallet,
    selectedAccounts,
    setSelectedAccounts,
    setSelectedCoin,
    setSelectedWallet,
    startAddAccounts,
    addSelectedAccounts,
    createNewSelectedAccounts,
    newAccounts,
    setNewSelectedAccounts,
    newSelectedAccounts,
    isStopped,
    onStop,
    onRetry,
    accounts,
    deviceEvents,
    addAccountStatus,
    error,
    handleWalletChange,
    walletDropdownList,
    onUserDetailsSubmit,
    isSubmittingUserDetails,
    email,
    setEmail,
    setHasErrors,
    onOTPSubmit,
    isSubmittingOTP,
    otpVerificationDetails,
    cantonAuthTokens,
    isUserEligibleForCanton,
    isUserInWaitingListForCanton,
  });

  return (
    <AddAccountDialogContext.Provider value={ctx}>
      {children}
    </AddAccountDialogContext.Provider>
  );
};

AddAccountDialogProvider.defaultProps = {
  walletId: undefined,
  coinId: undefined,
};

export function useAddAccountDialog(): AddAccountDialogContextInterface {
  return useContext(AddAccountDialogContext);
}
