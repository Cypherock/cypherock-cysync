// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import { IReceiveEvent } from '@cypherock/coin-support-interfaces';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
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
import { useAccountDropdown, useWalletDropdown } from '~/hooks';
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
} from '../Dialogs';

export interface ReceiveDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  onClose: () => void;
  onSkip: () => void;
  onRetry: () => void;
  error: any | undefined;
  selectedWallet: IWallet | undefined;
  setSelectedWallet: React.Dispatch<React.SetStateAction<IWallet | undefined>>;
  selectedAccount: IAccount | undefined;
  setSelectedAccount: React.Dispatch<
    React.SetStateAction<IAccount | undefined>
  >;
  derivedAddress: string | undefined;
  isAddressVerified: boolean;
  deviceEvents: Record<number, boolean | undefined>;
  startFlow: () => Promise<void>;
  walletDropdownList: DropDownItemProps[];
  handleWalletChange: () => void;
  accountDropdownList: DropDownItemProps[];
  handleAccountChange: () => void;
  isStartedWithoutDevice: boolean;
  isFlowCompleted: boolean;
}

export const ReceiveDialogContext: Context<ReceiveDialogContextInterface> =
  createContext<ReceiveDialogContextInterface>(
    {} as ReceiveDialogContextInterface,
  );

export interface ReceiveDialogContextProviderProps {
  children: ReactNode;
  walletId?: string;
  accountId?: string;
}

export const ReceiveDialogProvider: FC<ReceiveDialogContextProviderProps> = ({
  children,
  walletId: defaultWalletId,
  accountId: defaultAccountId,
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
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [isFlowCompleted, setIsFlowCompleted] = useState(false);
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const [isStartedWithoutDevice, setIsStartedWithoutDevice] =
    useState<boolean>(false);

  const flowSubscription = useRef<Subscription | undefined>();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {
    1: [0],
    2: [0],
  };

  const onRetry = () => {
    resetStates();
    goTo(1, 0);
  };

  const tabs: ITabs = [
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
      dialogs: [<VerifyAddress />],
    },
    {
      name: '',
      dialogs: [<FinalMessage />],
      dontShowOnMilestone: true,
    },
  ];

  const onClose = () => {
    cleanUp();
    dispatch(closeDialog('receive'));
  };

  const onSkip = () => {
    setIsStartedWithoutDevice(true);
    goTo(1, 0);
  };

  const resetStates = (forFlow?: boolean) => {
    setDeviceEvents({});
    setDerivedAddress(undefined);
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
  };

  const getFlowObserver = (onEnd: () => void): Observer<IReceiveEvent> => ({
    next: payload => {
      if (payload.device) {
        setDeviceEvents({ ...payload.device.events });
      }

      if (payload.address) {
        setDerivedAddress(payload.address);
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
    if (isStartedWithoutDevice && derivedAddress) {
      goTo(3, 0);
    }
  }, [isStartedWithoutDevice, derivedAddress]);

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
  });

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
      error,
      onRetry,
      onSkip,
      selectedWallet,
      setSelectedWallet,
      selectedAccount,
      setSelectedAccount,
      derivedAddress,
      isAddressVerified,
      deviceEvents,
      startFlow,
      handleAccountChange,
      handleWalletChange,
      accountDropdownList,
      walletDropdownList,
      isStartedWithoutDevice,
      isFlowCompleted,
    }),
    [
      onNext,
      onPrevious,
      goTo,
      onClose,
      currentTab,
      currentDialog,
      isDeviceRequired,
      tabs,
      error,
      onRetry,
      onSkip,
      selectedWallet,
      setSelectedWallet,
      selectedAccount,
      setSelectedAccount,
      derivedAddress,
      isAddressVerified,
      deviceEvents,
      startFlow,
      handleAccountChange,
      handleWalletChange,
      accountDropdownList,
      walletDropdownList,
      isStartedWithoutDevice,
      isFlowCompleted,
    ],
  );

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
};
