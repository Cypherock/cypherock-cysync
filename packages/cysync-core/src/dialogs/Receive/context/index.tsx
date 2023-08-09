// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import { IReceiveEvent } from '@cypherock/coin-support-interfaces';
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
import { DialogLoader } from '../Dialogs/DialogLoader';

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
}

export const ReceiveDialogContext: Context<ReceiveDialogContextInterface> =
  createContext<ReceiveDialogContextInterface>(
    {} as ReceiveDialogContextInterface,
  );

export interface ReceiveDialogContextProviderProps {
  children: ReactNode;
}

export const ReceiveDialogProvider: FC<ReceiveDialogContextProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const [error, setError] = useState<any | undefined>();
  const { connection, connectDevice } = useDevice();

  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();
  const [selectedAccount, setSelectedAccount] = useState<
    IAccount | undefined
  >();

  const [derivedAddress, setDerivedAddress] = useState<string | undefined>();
  const [isAddressVerified, setIsAddressVerified] = useState(false);
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});

  const flowSubscription = useRef<Subscription | undefined>();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {
    1: [0],
    2: [0],
  };

  const onRetry = () => {
    resetStates();
    goTo(0, 1);
  };

  const tabs: ITabs = [
    {
      name: lang.strings.receive.aside.tabs.source,
      dialogs: [<SelectionDialog />, <DialogLoader />],
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
    cleanUp();
    setError(undefined);
    goTo(3, 0);
  };

  const resetStates = () => {
    setDeviceEvents({});
    setDerivedAddress(undefined);
    setIsAddressVerified(false);
    setError(undefined);
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
    logger.info('Started add account');

    if (!selectedAccount || !selectedWallet) {
      logger.info('Flow started without selecting wallet or account');
      return;
    }

    resetStates();
    cleanUp();
    const coinSupport = getCoinSupport(selectedAccount.familyId);

    const taskId = lodash.uniqueId('task-');

    if (connection) await deviceLock.acquire(connection.device, taskId);

    const onEnd = () => {
      if (connection) deviceLock.release(connection.device, taskId);
    };

    const deviceConnection = connection
      ? await connectDevice(connection.device)
      : undefined;

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
    if (connection && derivedAddress) {
      startFlow();
    }
  }, [connection]);

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
