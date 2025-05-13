// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import { IcpSupport } from '@cypherock/coin-support-icp';
import { IReceiveEvent } from '@cypherock/coin-support-interfaces';
import { coinFamiliesMap } from '@cypherock/coins';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import { AccountTypeMap, IAccount, IWallet } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Observer, Subscription } from 'rxjs';

import { deviceLock, useDevice } from '~/context';
import { useAccountDropdown, useMemoReturn, useWalletDropdown } from '~/hooks';
import { ITabs, useTabsAndDialogs } from '~/hooks/useTabsAndDialogs';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

import {
  SelectionDialog,
  DeviceAction,
  VerifyAddress,
  FinalMessage,
  VerifyAccountId,
  VerifyPrincipalId,
} from '../Dialogs';

export enum ReceiveFlowSource {
  DEFAULT = 0,
  SWAP,
}

export interface ReceiveDialogContextInterface {
  source: ReceiveFlowSource;
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  onClose: () => void;
  onSkip: () => void;
  onDeviceActionNext: () => void;
  onAddressVerificationNext: () => void;
  onRetry: () => void;
  error: any | undefined;
  selectedWallet: IWallet | undefined;
  setSelectedWallet: React.Dispatch<React.SetStateAction<IWallet | undefined>>;
  selectedAccount: IAccount | undefined;
  setSelectedAccount: React.Dispatch<
    React.SetStateAction<IAccount | undefined>
  >;
  derivedAddress: string | undefined;
  derivedAccountId: string | undefined;
  derivedPrincipalId: string | undefined;
  isAddressVerified: boolean;
  deviceEvents: Record<number, boolean | undefined>;
  startFlow: () => Promise<void>;
  walletDropdownList: DropDownItemProps[];
  handleWalletChange: (id?: string | undefined) => void;
  accountDropdownList: DropDownItemProps[];
  handleAccountChange: (id?: string | undefined) => void;
  isStartedWithoutDevice: boolean;
  isFlowCompleted: boolean;
  defaultWalletId?: string;
  defaultAccountId?: string;
  validTill?: number;
}

export const ReceiveDialogContext: Context<ReceiveDialogContextInterface> =
  createContext<ReceiveDialogContextInterface>(
    {} as ReceiveDialogContextInterface,
  );

export interface ReceiveDialogContextProviderProps {
  children: ReactNode;
  walletId?: string;
  accountId?: string;
  skipSelection?: boolean;
  storeReceiveAddress?: (address: string) => void;
  onClose?: () => void;
  source?: ReceiveFlowSource;
  onError?: (e?: any) => void;
  validTill?: number;
}

export const ReceiveDialogProvider: FC<ReceiveDialogContextProviderProps> = ({
  children,
  walletId: defaultWalletId,
  accountId: defaultAccountId,
  skipSelection,
  storeReceiveAddress,
  onClose: onCloseInjected,
  source = ReceiveFlowSource.DEFAULT,
  onError: injectedOnError,
  validTill,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<any | undefined>();
  const { connection } = useDevice();

  const {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
  } = useWalletDropdown({
    walletId: defaultWalletId,
  });
  const {
    selectedAccount,
    setSelectedAccount,
    handleAccountChange,
    accountDropdownList,
  } = useAccountDropdown({
    selectedWallet,
    defaultAccountId,
    includeSubAccounts: true,
  });

  const [derivedAddress, setDerivedAddress] = useState<string | undefined>();
  const [derivedAccountId, setDerivedAccountId] = useState<
    string | undefined
  >();
  const [derivedPrincipalId, setDerivedPrincipalId] = useState<
    string | undefined
  >();
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [isFlowCompleted, setIsFlowCompleted] = useState(false);
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const [isStartedWithoutDevice, setIsStartedWithoutDevice] =
    useState<boolean>(false);

  const flowSubscription = useRef<Subscription | undefined>();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        1: [0],
        2: [0],
      }),
      [],
    );

  const onRetry = () => {
    resetStates();
    goTo(1, 0);
  };

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.receive.aside.tabs.source,
        dialogs: [<SelectionDialog />],
      },
      {
        name: lang.strings.receive.aside.tabs.device,
        dialogs: [<DeviceAction />],
      },
      {
        name: lang.strings.receive.aside.tabs.receive,
        dialogs: [
          <VerifyAddress />,
          <VerifyAccountId />,
          <VerifyPrincipalId />,
        ],
      },
      {
        name: '',
        dialogs: [<FinalMessage />],
        dontShowOnMilestone: true,
      },
    ],
    [lang],
  );

  if (storeReceiveAddress) {
    useEffect(() => {
      if (isAddressVerified) {
        if (selectedAccount?.familyId === coinFamiliesMap.icp) {
          const isIcpToken = selectedAccount.type === AccountTypeMap.subAccount;
          if (isIcpToken && derivedPrincipalId) {
            storeReceiveAddress(derivedPrincipalId);
          } else if (derivedAccountId) {
            storeReceiveAddress(derivedAccountId);
          }
        } else if (derivedAddress) {
          storeReceiveAddress(derivedAddress);
        }

        if (source === ReceiveFlowSource.SWAP) onClose();
      }
    }, [
      derivedAddress,
      derivedPrincipalId,
      derivedAccountId,
      isAddressVerified,
    ]);
  }

  const onClose = () => {
    cleanUp();
    dispatch(closeDialog('receive'));
    if (onCloseInjected) onCloseInjected();
  };

  const onSkip = () => {
    setIsStartedWithoutDevice(true);
    goTo(1, 0);
  };

  const onDeviceActionNext = () => {
    const isIcpAccount = selectedAccount?.familyId === coinFamiliesMap.icp;
    if (isIcpAccount) {
      goTo(2, 1);
    } else {
      onNext();
    }
  };

  const onAddressVerificationNext = () => {
    if (source !== ReceiveFlowSource.SWAP) {
      goTo(3);
    }
  };

  const resetStates = (forFlow?: boolean) => {
    setDeviceEvents({});
    setDerivedAddress(undefined);
    setDerivedAccountId(undefined);
    setDerivedPrincipalId(undefined);
    setIsAddressVerified(false);
    setIsFlowCompleted(false);
    setError(undefined);
    if (!forFlow) setIsStartedWithoutDevice(false);
  };

  const cleanUp = () => {
    if (flowSubscription.current) {
      flowSubscription.current.unsubscribe();
      flowSubscription.current = undefined;
    }
  };

  const onError = (e?: any) => {
    cleanUp();
    setError(e);
    if (injectedOnError) injectedOnError(e);
  };

  const getFlowObserver = (onEnd: () => void): Observer<IReceiveEvent> => ({
    next: payload => {
      if (payload.device) {
        setDeviceEvents({ ...payload.device.events });
      }

      if (payload.address) {
        if (selectedAccount?.familyId === coinFamiliesMap.icp) {
          const IcpCoinSupport = getCoinSupport(
            selectedAccount.familyId,
          ) as IcpSupport;
          const { accountId, principalId } =
            IcpCoinSupport.getAddressDetailsFromPublicKey({
              pubKey: payload.address,
            });

          setDerivedAccountId(accountId);
          setDerivedPrincipalId(principalId);
        } else {
          setDerivedAddress(payload.address);
        }
      }

      if (payload.didAddressMatched !== undefined) {
        setIsAddressVerified(payload.didAddressMatched);
      }
    },
    error: err => {
      onEnd();
      onError(err);
    },
    complete: () => {
      onEnd();
      cleanUp();
    },
  });

  const startFlow = async () => {
    logger.info('Started Receive Flow');

    if (!selectedAccount || !selectedWallet) {
      logger.warn('Flow started without selecting wallet or account');
      return;
    }

    resetStates(true);
    cleanUp();

    const coinSupport = getCoinSupport(selectedAccount.familyId);

    const taskId = lodash.uniqueId('task-');

    if (connection) await deviceLock.acquire(connection.device, taskId);

    const onEnd = () => {
      setIsFlowCompleted(true);
      if (connection) deviceLock.release(connection.device, taskId);
    };

    const deviceConnection = connection?.connection;

    if (!deviceConnection) setIsStartedWithoutDevice(true);

    const subscription = coinSupport
      .receive({
        accountId: selectedAccount.__id ?? '',
        connection: deviceConnection,
        db: getDB(),
      })
      .subscribe(getFlowObserver(onEnd));

    flowSubscription.current = subscription;
  };

  useEffect(() => {
    if (
      isStartedWithoutDevice &&
      (derivedAddress || (derivedAccountId && derivedPrincipalId))
    ) {
      goTo(3, 0);
    }
  }, [
    isStartedWithoutDevice,
    derivedAddress,
    derivedAccountId,
    derivedPrincipalId,
  ]);

  useEffect(() => {
    if (skipSelection && defaultWalletId && defaultAccountId) {
      onNext();
    }
  }, []);

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
    dialogName: 'receive',
  });

  const ctx = useMemoReturn({
    source,
    defaultWalletId,
    defaultAccountId,
    onNext,
    onPrevious,
    tabs,
    onClose,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
    error,
    onRetry,
    onSkip,
    onDeviceActionNext,
    onAddressVerificationNext,
    selectedWallet,
    setSelectedWallet,
    selectedAccount,
    setSelectedAccount,
    derivedAddress,
    derivedAccountId,
    derivedPrincipalId,
    isAddressVerified,
    deviceEvents,
    startFlow,
    handleAccountChange,
    handleWalletChange,
    accountDropdownList,
    walletDropdownList,
    isStartedWithoutDevice,
    isFlowCompleted,
    validTill,
  });

  return (
    <ReceiveDialogContext.Provider value={ctx}>
      {children}
    </ReceiveDialogContext.Provider>
  );
};

export function useReceiveDialog(): ReceiveDialogContextInterface {
  return useContext(ReceiveDialogContext);
}

ReceiveDialogProvider.defaultProps = {
  walletId: undefined,
  accountId: undefined,
  skipSelection: undefined,
  storeReceiveAddress: undefined,
  onClose: undefined,
  source: ReceiveFlowSource.DEFAULT,
  onError: undefined,
  validTill: undefined,
};
