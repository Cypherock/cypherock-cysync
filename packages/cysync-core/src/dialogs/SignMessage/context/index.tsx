import { getCoinSupport } from '@cypherock/coin-support';
import {
  ISignMessageEvent,
  ISignMessageParamsPayload,
  SignMessageType,
} from '@cypherock/coin-support-interfaces';
import lodash from 'lodash';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Observer, Subscription } from 'rxjs';

import {
  WalletConnectSignMessageMap,
  deviceLock,
  useDevice,
  useWalletConnect,
} from '~/context';
import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

import { ViewMessageDialog, ViewSigningStateDialog } from '../Dialogs';

export interface SignMessageDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  deviceEvents: Record<number, boolean | undefined>;
  setDeviceEvents: React.Dispatch<
    React.SetStateAction<Record<number, boolean | undefined>>
  >;
  payload: ISignMessageParamsPayload | undefined;
  startFlow: () => Promise<void>;
  error: any | undefined;
  onRetry: () => void;
}

export const SignMessageDialogContext: Context<SignMessageDialogContextInterface> =
  createContext<SignMessageDialogContextInterface>(
    {} as SignMessageDialogContextInterface,
  );

export interface SignMessageDialogProviderProps {
  children: ReactNode;
}

export const SignMessageDialogProvider: FC<SignMessageDialogProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const {
    rejectCallRequest,
    callRequestData,
    approveCallRequest,
    activeAccount,
    activeWallet,
  } = useWalletConnect();

  const { connection } = useDevice();
  const [error, setError] = useState<any | undefined>();
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        1: [0],
      }),
      [],
    );
  const flowSubscription = useRef<Subscription | undefined>();

  const payload: ISignMessageParamsPayload | undefined = useMemo(() => {
    if (!callRequestData) return undefined;

    const [, content] = callRequestData.params;

    const result = {
      message: content as string,
      signingType:
        WalletConnectSignMessageMap[callRequestData.method] ??
        SignMessageType.ETH_MESSAGE,
    };

    if (result.signingType === SignMessageType.PRIVATE_MESSAGE)
      result.message = callRequestData.params[0] as string;

    return result;
  }, [callRequestData]);

  const cleanUp = () => {
    if (flowSubscription.current) {
      flowSubscription.current.unsubscribe();
      flowSubscription.current = undefined;
    }
  };
  const onClose = (dontReject?: boolean) => {
    cleanUp();
    if (dontReject !== true) rejectCallRequest(error?.message);
    dispatch(closeDialog('signMessage'));
  };

  const onError = (err?: any) => {
    cleanUp();
    setError(err);
  };

  const onRetry = () => {
    setDeviceEvents({});
    setError(undefined);
  };

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.signMessage.title,
        dialogs: [<ViewMessageDialog key="view-message" />],
      },
      {
        name: lang.strings.signMessage.title,
        dialogs: [<ViewSigningStateDialog key="signing" />],
      },
    ],
    [lang],
  );

  const getFlowObserver = (onEnd: () => void): Observer<ISignMessageEvent> => ({
    next: payloadParam => {
      if (payloadParam.device) {
        setDeviceEvents({ ...payloadParam.device.events });
      }

      if (payloadParam.signature) {
        approveCallRequest(payloadParam.signature);
      }
    },
    error: err => {
      logger.error(err);
      onEnd();
      onError(err);
    },
    complete: () => {
      onEnd();
      onClose(true);
    },
  });

  const startFlow = async () => {
    logger.info('Started Sign Message Flow');

    if (!activeAccount || !activeWallet || !payload) {
      logger.warn('Flow started without selecting wallet or account');
      onError(
        new Error(
          'No account is selected for this request. Reconnect WalletConnect with an account on the requested chain',
        ),
      );
      return;
    }

    cleanUp();

    const taskId = lodash.uniqueId('task-');

    const onEnd = () => {
      if (connection) deviceLock.release(connection.device, taskId);
    };

    try {
      const coinSupport = getCoinSupport(activeAccount.familyId);

      if (connection) await deviceLock.acquire(connection.device, taskId);

      const deviceConnection = connection?.connection;

      if (!deviceConnection) {
        onEnd();
        return;
      }

      flowSubscription.current = coinSupport
        .signMessage({
          account: activeAccount,
          connection: deviceConnection,
          db: getDB(),
          payload,
        })
        .subscribe(getFlowObserver(onEnd));
    } catch (e) {
      logger.error(e);
      onEnd();
      onError(e);
    }
  };

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
    dialogName: 'signMessage',
  });

  const ctx = useMemo(
    () => ({
      isDeviceRequired,
      currentTab,
      currentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
      onClose,
      deviceEvents,
      setDeviceEvents,
      payload,
      startFlow,
      error,
      onRetry,
    }),
    [
      isDeviceRequired,
      currentTab,
      currentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
      onClose,
      deviceEvents,
      setDeviceEvents,
      payload,
      startFlow,
      error,
      onRetry,
    ],
  );

  return (
    <SignMessageDialogContext.Provider value={ctx}>
      {children}
    </SignMessageDialogContext.Provider>
  );
};

export function useSignMessageDialog(): SignMessageDialogContextInterface {
  return useContext(SignMessageDialogContext);
}
