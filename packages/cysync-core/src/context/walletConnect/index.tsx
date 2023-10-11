import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { parseUri } from '@walletconnect/utils';
import PropTypes from 'prop-types';
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

import {
  openSendDialog,
  openSignMessageDialog,
  openWalletConnectDialog,
} from '~/actions';
import { closeDialog as closeDialogDispatch, useAppDispatch } from '~/store';
import {
  getAddExternalLinkListenerMethod,
  getInitWCUriMethod,
  getRemoveExternalLinkListenerMethod,
} from '~/utils';
import logger from '~/utils/logger';

import {
  ACCEPTED_SEND_METHODS,
  ACCEPTED_SIGN_METHODS,
  IWalletConnectMethods,
  WalletConnectCallRequestData,
  WalletConnectConnectionState,
  WalletConnectionConnectionClientMeta,
} from './type';
import { useWalletConnectV1, useWalletConnectV2 } from './versions';

export * from './type';

const CONNECTION_TIMEOUT = 5000;

export interface WalletConnectContextInterface {
  openDialog: () => void;
  handleClose: () => void;
  connectionState: WalletConnectConnectionState;
  createConnection: (url: string) => Promise<void>;
  connectionError: string;
  connectionClientMeta: WalletConnectionConnectionClientMeta | undefined;
  approveSessionRequest: (accounts: IAccount[]) => Promise<void>;
  approveCallRequest: (result: string) => void;
  rejectCallRequest: (reason?: string) => void;
  callRequestData: WalletConnectCallRequestData | undefined;
  activeAccount: IAccount | undefined;
  activeWallet: IWallet | undefined;
  selectedAccounts: IAccount[];
  requiredNamespaces: string[];
  optionalNamespaces: string[];
  errorTitle: string;
  errorSubtitle: string;
  unsupportedOptionalChainsMessage: string | undefined;
  version: number;
}

export const WalletConnectContext: Context<WalletConnectContextInterface> =
  createContext<WalletConnectContextInterface>(
    {} as WalletConnectContextInterface,
  );

export const WalletConnectProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const [activeWallet, setActiveWallet] = useState<IWallet | undefined>();
  const [activeAccount, setActiveAccount] = useState<IAccount | undefined>();
  const [connectionError, setConnectionError] = useState('');
  const [connectionState, setConnectionState] =
    useState<WalletConnectConnectionState>(
      WalletConnectConnectionState.NOT_CONNECTED,
    );
  const [connectionClientMeta, setConnectionClientMeta] = useState<
    WalletConnectionConnectionClientMeta | undefined
  >(undefined);
  const [callRequestData, setCallRequestData] = useState<
    WalletConnectCallRequestData | undefined
  >(undefined);

  const connectionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const [errorTitle, setErrorTitle] = useState('');
  const [errorSubtitle, setErrorSubtitle] = useState('');

  const [version, setVersion] = useState(2);
  const openDialog = () => {
    dispatch(openWalletConnectDialog());
  };
  const closeDialog = () => {
    dispatch(closeDialogDispatch('walletConnect'));
  };
  const v1Methods = useWalletConnectV1({
    setConnectionClientMeta,
    connectionState,
    setConnectionState,
    callRequestData,
    setCallRequestData,
    setConnectionError,
    setErrorTitle,
    setErrorSubtitle,
    connectionTimeoutRef,
    openDialog,
    closeDialog,
    setActiveAccount,
    setActiveWallet,
  });
  const {
    methods: v2Methods,
    requiredNamespaces,
    optionalNamespaces,
    unsupportedOptionalChainsMessage,
    selectedAccounts,
  } = useWalletConnectV2({
    setConnectionClientMeta,
    connectionState,
    setConnectionState,
    callRequestData,
    setCallRequestData,
    setConnectionError,
    setErrorTitle,
    setErrorSubtitle,
    connectionTimeoutRef,
    openDialog,
    closeDialog,
    setActiveAccount,
    setActiveWallet,
  });

  const versionMap: Record<number, IWalletConnectMethods> = {
    1: v1Methods,
    2: v2Methods,
  };

  const getWalletConnectApi = (_version?: number) => {
    const usingVersion = _version ?? version;
    if (versionMap[usingVersion] === undefined)
      throw new Error('Unsupported WalletConnect version');
    return versionMap[usingVersion];
  };

  useEffect(() => {
    if (!connectionError) {
      setErrorSubtitle('');
      setErrorTitle('');
    }
  }, [connectionError]);

  const resetStates = () => {
    setConnectionClientMeta(undefined);
    setCallRequestData(undefined);
    setActiveAccount(undefined);
    setVersion(2);
    Object.values(versionMap).forEach(methods => methods.resetStates());
  };

  useEffect(() => {
    if (connectionState === WalletConnectConnectionState.NOT_CONNECTED)
      resetStates();
  }, [connectionState]);

  const disconnect = async () => {
    await getWalletConnectApi().disconnect();
    setConnectionState(WalletConnectConnectionState.NOT_CONNECTED);
  };

  const handleClose = () => {
    closeDialog();
    disconnect();
    setActiveWallet(undefined);
    setActiveAccount(undefined);
    setConnectionError('');
  };

  const approveSessionRequest = async (accounts: IAccount[]) => {
    logger.info('WalletConnect: Approving session request');
    try {
      await getWalletConnectApi().approveSession(accounts);
    } catch (error) {
      if (error) {
        logger.error('WalletConnect: Error in approving session request');
        logger.error(error);
        setConnectionError((error as any).message);
      }
      setConnectionState(WalletConnectConnectionState.CONNECTION_ERROR);
    }
  };

  const approveCallRequest = async (result: string) => {
    logger.info('WalletConnect: Approving call request', { result });
    await getWalletConnectApi().approveCall(result);
    setCallRequestData(undefined);
  };

  const rejectCallRequest = async (message?: string) => {
    logger.info('WalletConnect: Rejecting call request', { message });
    await getWalletConnectApi().rejectCall(message);
    setCallRequestData(undefined);
  };

  const walletConnectInit = async (uri: string) => {
    // need to clear local storage as a workaround
    // https://github.com/orgs/WalletConnect/discussions/3291
    window.localStorage.clear();
    const { version: walletConnectVersion } = parseUri(uri);
    setVersion(walletConnectVersion);

    const cysyncMetadata = {
      description: 'Cypherock CySync',
      url: 'https://www.cypherock.com',
      icons: ['https://www.cypherock.com/favicon.svg'],
      name: 'Cypherock CySync',
    };

    await getWalletConnectApi(walletConnectVersion).init(uri, cysyncMetadata);
  };

  const createConnection = async (uri: string) => {
    try {
      logger.info('WalletConnect: Creating connection', { url: uri });
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }

      setConnectionError('');
      setConnectionState(WalletConnectConnectionState.CONNECTING);

      await walletConnectInit(uri);

      connectionTimeoutRef.current = setTimeout(() => {
        logger.info(
          'WalletConnect: Connection timeout exceeded, disconnecting...',
          { uri },
        );
        setConnectionError('Timeout exceeded');
        setConnectionState(WalletConnectConnectionState.CONNECTION_ERROR);
        openDialog();
      }, CONNECTION_TIMEOUT);
    } catch (error) {
      if (error) {
        logger.error('WalletConnect: Connection error');
        logger.error(error);
        setConnectionError((error as any).message);
      }
      setConnectionState(WalletConnectConnectionState.CONNECTION_ERROR);
      openDialog();
    }
  };

  const onExternalLink = (uri: string) => {
    logger.info('WalletConnect: Open', { uri });
    if (connectionState === WalletConnectConnectionState.NOT_CONNECTED) {
      createConnection(uri);
    }
  };

  const getInitialUri = async () => {
    const uri = await getInitWCUriMethod()();
    if (uri) onExternalLink(uri);
  };
  useEffect(() => {
    getAddExternalLinkListenerMethod()(onExternalLink);
    getInitialUri();
    return () => {
      getRemoveExternalLinkListenerMethod()();
    };
  }, []);

  useEffect(() => {
    if (
      connectionState === WalletConnectConnectionState.CONNECTED &&
      callRequestData
    ) {
      if (ACCEPTED_SEND_METHODS.includes(callRequestData.method)) {
        // TODO: add props for send dialog
        dispatch(openSendDialog());
      } else if (ACCEPTED_SIGN_METHODS.includes(callRequestData.method)) {
        dispatch(openSignMessageDialog());
      } else {
        logger.error('WalletConnect: Unsupported Call Request received');
      }
    }
  }, [callRequestData]);

  const context = useMemo(
    () => ({
      handleClose,
      connectionState,
      createConnection,
      openDialog,
      connectionError,
      approveSessionRequest,
      connectionClientMeta,
      approveCallRequest,
      rejectCallRequest,
      callRequestData,
      activeAccount,
      activeWallet,
      selectedAccounts,
      version,
      requiredNamespaces,
      optionalNamespaces,
      errorTitle,
      errorSubtitle,
      unsupportedOptionalChainsMessage,
    }),
    [
      handleClose,
      connectionState,
      createConnection,
      openDialog,
      connectionError,
      approveSessionRequest,
      connectionClientMeta,
      approveCallRequest,
      rejectCallRequest,
      callRequestData,
      activeAccount,
      activeWallet,
      selectedAccounts,
      version,
      requiredNamespaces,
      optionalNamespaces,
      errorTitle,
      errorSubtitle,
      unsupportedOptionalChainsMessage,
    ],
  );

  return (
    <WalletConnectContext.Provider value={context}>
      {children}
    </WalletConnectContext.Provider>
  );
};

WalletConnectProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useWalletConnect(): WalletConnectContextInterface {
  return useContext(WalletConnectContext);
}