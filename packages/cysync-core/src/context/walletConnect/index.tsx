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
import { useStateToRef } from '~/hooks';
import {
  closeDialog as closeDialogDispatch,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';
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
  isApprovingSession: boolean;
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
  setExternalCallRequest: (request: WalletConnectCallRequestData | undefined) => void;
  setExternalActiveAccount: (account: IAccount | undefined) => void;
  setExternalActiveWallet: (wallet: IWallet | undefined) => void;
  setWidgetApproveHandler: (handler: ((result: string) => void) | null) => void;
  setWidgetRejectHandler: (handler: ((reason?: string) => void) | null) => void;
}

export const WalletConnectContext: Context<WalletConnectContextInterface> =
  createContext<WalletConnectContextInterface>(
    {} as WalletConnectContextInterface,
  );

export const WalletConnectProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { wallets } = useAppSelector(selectWallets);
  const walletsRef = useStateToRef(wallets);
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
  
  // Widget approve/reject handlers - when set, these override WalletConnect's normal flow
  const widgetApproveHandlerRef = useRef<((result: string) => void) | null>(null);
  const widgetRejectHandlerRef = useRef<((reason?: string) => void) | null>(null);

  const [errorTitle, setErrorTitle] = useState('');
  const [errorSubtitle, setErrorSubtitle] = useState('');

  const [version, setVersion] = useState(2);
  const [isApprovingSession, setIsApprovingSession] = useState(false);
  const openDialog = () => {
    dispatch(openWalletConnectDialog());
  };
  const closeDialog = () => {
    dispatch(closeDialogDispatch('walletConnect'));
  };

  const updateActiveAccount = (account?: IAccount) => {
    const foundWallet = walletsRef.current.find(
      wallet => wallet.__id === account?.walletId,
    );
    setActiveAccount(account);
    setActiveWallet(foundWallet);
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
    updateActiveAccount,
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
    updateActiveAccount,
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
    updateActiveAccount(undefined);
    setVersion(2);
    widgetApproveHandlerRef.current = null;
    widgetRejectHandlerRef.current = null;
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
    updateActiveAccount(undefined);
    setConnectionError('');
  };

  const approveSessionRequest = async (accounts: IAccount[]) => {
    logger.info('WalletConnect: Approving session request');
    setIsApprovingSession(true);
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
    setIsApprovingSession(false);
  };

  const approveCallRequest = async (result: string) => {
    logger.info('WalletConnect: Approving call request', { result });
    
    // If widget handler is set, delegate to widget instead of WalletConnect
    if (widgetApproveHandlerRef.current) {
      logger.info('WalletConnect: Delegating to widget approve handler');
      widgetApproveHandlerRef.current(result);
      // Clear handlers after use
      widgetApproveHandlerRef.current = null;
      widgetRejectHandlerRef.current = null;
      // Clear external data
      setCallRequestData(undefined);
      setActiveAccount(undefined);
      setActiveWallet(undefined);
      return;
    }
    
    // Normal WalletConnect flow
    await getWalletConnectApi().approveCall(result);
    setCallRequestData(undefined);
  };

  const rejectCallRequest = async (message?: string) => {
    logger.info('WalletConnect: Rejecting call request', { message });
    
    // If widget handler is set, delegate to widget instead of WalletConnect
    if (widgetRejectHandlerRef.current) {
      logger.info('WalletConnect: Delegating to widget reject handler');
      widgetRejectHandlerRef.current(message);
      // Clear handlers after use
      widgetApproveHandlerRef.current = null;
      widgetRejectHandlerRef.current = null;
      // Clear external data
      setCallRequestData(undefined);
      setActiveAccount(undefined);
      setActiveWallet(undefined);
      return;
    }
    
    // Normal WalletConnect flow
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
      logger.info(' Initiating Call Request', callRequestData);
      if (ACCEPTED_SEND_METHODS.includes(callRequestData.method)) {
        dispatch(
          openSendDialog({
            walletId: activeWallet?.__id,
            accountId: activeAccount?.__id,
            txnData: callRequestData.params[0],
            disableAccountSelection: true,
            isWalletConnectRequest: true,
          }),
        );
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
      isApprovingSession,
      setExternalCallRequest: setCallRequestData,
      setExternalActiveAccount: setActiveAccount,
      setExternalActiveWallet: setActiveWallet,
      setWidgetApproveHandler: (handler: ((result: string) => void) | null) => {
        widgetApproveHandlerRef.current = handler;
      },
      setWidgetRejectHandler: (handler: ((reason?: string) => void) | null) => {
        widgetRejectHandlerRef.current = handler;
      },
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
      isApprovingSession,
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