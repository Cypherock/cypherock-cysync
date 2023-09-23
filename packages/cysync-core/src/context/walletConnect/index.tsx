import { evmCoinList } from '@cypherock/coins';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import WalletConnect from '@walletconnect/legacy-client';
import { SessionTypes } from '@walletconnect/types';
import {
  buildApprovedNamespaces,
  getSdkError,
  normalizeNamespaces,
  parseUri,
} from '@walletconnect/utils';
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { Web3Wallet as Web3WalletType } from '@walletconnect/web3wallet/dist/types/client';
import PropTypes from 'prop-types';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { openWalletConnectDialog } from '~/actions';
import { useAccountDropdown } from '~/hooks';
import { closeDialog as closeDialogDispatch, useAppDispatch } from '~/store';
import logger from '~/utils/logger';

import {
  WalletConnectCallRequestData,
  WalletConnectCallRequestMethodMap,
  WalletConnectConnectionState,
  WalletConnectionConnectionClientMeta,
} from './type';

const { Core } = (window as any).WalletConnectCore;
const { Web3Wallet } = (window as any).WalletConnect;

export * from './type';

const ACCEPTED_CALL_METHODS = [
  WalletConnectCallRequestMethodMap.ETH_SIGN_TXN,
  WalletConnectCallRequestMethodMap.ETH_SEND_TXN,
  WalletConnectCallRequestMethodMap.ETH_SIGN,
  WalletConnectCallRequestMethodMap.SIGN_PERSONAL,
  WalletConnectCallRequestMethodMap.SIGN_TYPED,
  WalletConnectCallRequestMethodMap.SIGN_TYPED_V4,
];

const CONNECTION_TIMEOUT = 5000;
const WALLET_CONNECT_PROJECT_ID = '892cb46355562fd3e2d37d2361f44c1d';

export interface WalletConnectContextInterface {
  openDialog: () => void;
  handleClose: () => void;
  connectionState: WalletConnectConnectionState;
  createConnection: (url: string) => Promise<void>;
  connectionError: string;
  connectionClientMeta: WalletConnectionConnectionClientMeta | undefined;
  approveCallRequest: (result: string) => void;
  rejectCallRequest: (reason?: string) => void;
  callRequestData: WalletConnectCallRequestData | undefined;
  selectAccount: (account: IAccount) => void;
  selectedAccount: IAccount | undefined;
  selectedWallet: IWallet | undefined;
  setSelectedWallet: (wallet: IWallet) => void;
  requiredNamespaces: string[];
  optionalNamespaces: string[];
  errorTitle: string;
  errorSubtitle: string;
}

export const WalletConnectContext: React.Context<WalletConnectContextInterface> =
  React.createContext<WalletConnectContextInterface>(
    {} as WalletConnectContextInterface,
  );

export const WalletConnectProvider: React.FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const {
    selectedAccount,
    selectedWallet,
    setSelectedWallet,
    setSelectedAccount,
  } = useAccountDropdown();
  const selectedAccountsRef = useRef<IAccount[]>([]);
  const [connectionError, setConnectionError] = React.useState('');
  const [connectionState, setConnectionState] =
    useState<WalletConnectConnectionState>(
      WalletConnectConnectionState.NOT_CONNECTED,
    );
  const [connectionClientMeta, setConnectionClientMeta] = React.useState<
    WalletConnectionConnectionClientMeta | undefined
  >(undefined);
  const [callRequestData, setCallRequestData] = React.useState<
    WalletConnectCallRequestData | undefined
  >(undefined);

  const connectorRef = React.useRef<WalletConnect | undefined>(undefined);
  const connectionTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(
    undefined,
  );

  const [errorTitle, setErrorTitle] = useState('');
  const [errorSubtitle, setErrorSubtitle] = useState('');

  const [version, setVersion] = React.useState(2);
  const [requiredNamespaces, setRequiredNamespaces] = React.useState<string[]>(
    [],
  );
  const [optionalNamespaces, setOptionalNamespaces] = React.useState<string[]>(
    [],
  );
  const web3WalletRef = React.useRef<Web3WalletType | undefined>(undefined);
  const proposalRef = React.useRef<Web3WalletTypes.SessionProposal | undefined>(
    undefined,
  );
  const sessionRef = React.useRef<SessionTypes.Struct | undefined>(undefined);

  useEffect(() => {
    if (!connectionError) {
      setErrorSubtitle('');
      setErrorTitle('');
    }
  }, [connectionError]);

  const resetStates = () => {
    setConnectionClientMeta(undefined);
    setCallRequestData(undefined);
    setSelectedAccount(undefined);
    connectorRef.current = undefined;

    setRequiredNamespaces([]);
    setOptionalNamespaces([]);
    setVersion(2);
    web3WalletRef.current = undefined;
    proposalRef.current = undefined;
    selectedAccountsRef.current = [];
  };

  useEffect(() => {
    if (connectionState === WalletConnectConnectionState.NOT_CONNECTED)
      resetStates();
  }, [connectionState]);

  const openDialog = () => {
    dispatch(openWalletConnectDialog());
  };
  const closeDialog = () => {
    dispatch(closeDialogDispatch('walletConnect'));
  };

  const disconnect = async () => {
    connectorRef.current?.killSession();
    if (
      connectionState === WalletConnectConnectionState.CONNECTED &&
      sessionRef.current
    ) {
      await web3WalletRef.current?.disconnectSession({
        topic: sessionRef.current.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    } else if (
      connectionState !== WalletConnectConnectionState.CONNECTION_ERROR &&
      proposalRef.current
    ) {
      await web3WalletRef.current?.rejectSession({
        id: proposalRef.current.id,
        reason: getSdkError('USER_REJECTED'),
      });
    }
    setConnectionState(WalletConnectConnectionState.NOT_CONNECTED);
  };

  const handleClose = () => {
    closeDialog();
    disconnect();
    setSelectedWallet(undefined);
    setConnectionError('');
  };

  const selectAccount = (account: IAccount) => {
    try {
      if (account.familyId !== 'evm')
        throw new Error('Non EVM account in wallet connect');

      const coinMeta = evmCoinList[account.parentAssetId ?? ''];

      const address = account.xpubOrAddress;

      connectorRef.current?.approveSession({
        accounts: [address],
        chainId: coinMeta.chain,
      });
    } catch (error) {
      logger.error('WalletConnect: Error in selecting account');
      logger.error(error);
      disconnect();
    }
  };
  const approveCallRequest = async (result: string) => {
    logger.info('WalletConnect: Approving call request', { result });
    if (!callRequestData) return;

    if (version === 2 && callRequestData.topic) {
      await web3WalletRef.current?.respondSessionRequest({
        topic: callRequestData.topic,
        response: {
          id: callRequestData.id,
          jsonrpc: '2.0',
          result,
        },
      });
    } else if (callRequestData.id) {
      connectorRef.current?.approveRequest({
        id: callRequestData.id,
        result,
      });
    }
    setCallRequestData(undefined);
  };

  const rejectCallRequest = async (message?: string) => {
    logger.info('WalletConnect: Rejecting call request', { message });
    if (!callRequestData) return;

    if (version === 2 && callRequestData.topic) {
      await web3WalletRef.current?.respondSessionRequest({
        topic: callRequestData.topic,
        response: {
          id: callRequestData.id,
          jsonrpc: '2.0',
          error: {
            code: 5000,
            message: message ?? 'User rejected',
          },
        },
      });
    } else if (callRequestData.id) {
      connectorRef.current?.rejectRequest({
        id: callRequestData.id,
        error: {
          message: message ?? '',
        },
      });
    }
    setCallRequestData(undefined);
  };

  const walletConnectV1Methods = {
    handleSessionRequest: (error: Error | null, payload: any) => {
      if (error) {
        logger.error('WalletConnect: Session request error', error);
        return;
      }

      logger.info('WalletConnect: Session request received', payload);
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }

      setConnectionClientMeta(connectorRef.current?.peerMeta ?? undefined);
      setConnectionState(WalletConnectConnectionState.SELECT_ACCOUNT);
      openDialog();

      // focus event for mac
      // ipcRenderer.send('focus');
    },

    handleCallRequest: (error: Error | null, payload: any) => {
      if (error) {
        logger.error('WalletConnect: Session request error', error);
        return;
      }

      if (
        payload?.id &&
        payload?.params &&
        ACCEPTED_CALL_METHODS.includes(payload?.method)
      ) {
        // ipcRenderer.send('focus');
        logger.info('WalletConnect: Call Request received', { payload });
        const { params } = payload;
        setCallRequestData({ params, id: payload.id, method: payload.method });
      } else if (payload?.id) {
        logger.error('WalletConnect: Unsupported Call Request received', {
          payload,
        });
        connectorRef.current?.rejectRequest({
          id: payload.id,
          error: {
            message: 'Unsupported method',
          },
        });
      }
    },

    handleDisconnect: (error: Error | null) => {
      logger.info('WalletConnect: Disconnect');
      if (error) {
        logger.error(error);
      }
      setConnectionState(WalletConnectConnectionState.NOT_CONNECTED);
      setConnectionError('');
      closeDialog();
    },

    handleConnect: (error: Error | null) => {
      logger.info('WalletConnect: Connected');
      if (error) {
        logger.error(error);
      }
      setConnectionState(WalletConnectConnectionState.CONNECTED);
    },
  };

  const areChainsSupported = async (
    proposal: Web3WalletTypes.SessionProposal,
  ) => {
    const requiredChainList = proposal.params.requiredNamespaces;
    const optionalChainList = proposal.params.optionalNamespaces;
    const requiredChains = Object.values(normalizeNamespaces(requiredChainList))
      .map(namespace => namespace.chains ?? [])
      .flat();
    const optionalChains = Object.values(normalizeNamespaces(optionalChainList))
      .map(namespace => namespace.chains)
      .flat();

    const supportedNamespaces = Object.values(evmCoinList).map(
      item => `eip155:${item.chain}`,
    );
    const unsupportedChains = requiredChains.filter(
      chain => chain && !supportedNamespaces.includes(chain),
    );

    if (unsupportedChains.length === 0) {
      const supportedOptionalChains = supportedNamespaces
        .filter(chain => optionalChains.includes(chain))
        .filter(chain => !requiredChains.includes(chain));
      setRequiredNamespaces(requiredChains);
      setOptionalNamespaces(supportedOptionalChains);
      return true;
    }

    await web3WalletRef.current?.rejectSession({
      id: proposal.id,
      reason: getSdkError('UNSUPPORTED_CHAINS'),
    });

    const supportedChainNames = Object.values(evmCoinList).map(
      item => item.name,
    );

    const listToWords = (list: string[]) => {
      if (list.length === 1) {
        return list[0];
      }
      const last = list[list.length - 1];
      const newList = list.slice(0, list.length - 1);
      return `${newList.join(', ')} and ${last}`;
    };

    setErrorTitle(
      `${proposal.params.proposer.metadata.name} requested to connect to chain${
        unsupportedChains.length > 1 ? 's' : ''
      } we don't support yet`,
    );

    setErrorSubtitle(
      `We currently support ${listToWords(supportedChainNames)}`,
    );
    setConnectionError(`Unsupported Chains: ${listToWords(unsupportedChains)}`);

    setConnectionState(WalletConnectConnectionState.CONNECTION_ERROR);
    openDialog();

    logger.info('WalletConnect: Rejected due to unsupported chains');
    return false;
  };

  const walletConnectV2Methods = {
    handleSessionProposal: async (
      proposal: Web3WalletTypes.SessionProposal,
    ) => {
      logger.info('WalletConnect: Session proposal received', proposal);

      proposalRef.current = proposal;

      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }

      if (!(await areChainsSupported(proposal))) return;

      setConnectionClientMeta(proposal.params.proposer.metadata);
      setConnectionState(WalletConnectConnectionState.SELECT_ACCOUNT);
      openDialog();
      // focus event for mac
      // ipcRenderer.send('focus');
    },
  };

  const walletConnectInit = async (uri: string) => {
    const { version: walletConnectVersion } = parseUri(uri);
    setVersion(walletConnectVersion);

    const cysyncMetadata = {
      description: 'Cypherock CySync',
      url: 'https://www.cypherock.com',
      icons: ['https://www.cypherock.com/favicon.svg'],
      name: 'Cypherock CySync',
    };

    if (walletConnectVersion === 1) {
      const connector = new WalletConnect({
        uri,
        clientMeta: cysyncMetadata,
      });
      connectorRef.current = connector;

      connector.on(
        'session_request',
        walletConnectV1Methods.handleSessionRequest,
      );
      connector.on('call_request', walletConnectV1Methods.handleCallRequest);
      connector.on('disconnect', walletConnectV1Methods.handleDisconnect);
      connector.on('connect', walletConnectV1Methods.handleConnect);
    } else if (walletConnectVersion === 2) {
      const core = new Core({
        projectId: WALLET_CONNECT_PROJECT_ID,
      });

      const web3wallet = await Web3Wallet.init({
        core,
        metadata: cysyncMetadata,
      });

      web3WalletRef.current = web3wallet;

      web3wallet.on(
        'session_proposal',
        walletConnectV2Methods.handleSessionProposal,
      );

      web3wallet.on('session_delete', () => {
        setConnectionState(WalletConnectConnectionState.NOT_CONNECTED);
        setConnectionError('');
        closeDialog();
      });

      // web3wallet.on('session_request', async event => {
      //   const { account, wallet } =
      //     selectedAccountsRef.current[event.params.chainId];
      //   setSelectedWallet(wallet);
      //   setSelectedAccount(account);
      //   setCallRequestData({
      //     id: event.id,
      //     topic: event.topic,
      //     params: event.params.request.params,
      //     method: event.params.request.method as any,
      //   });
      //   // ipcRenderer.send('focus');
      //   logger.info('WalletConnect: Call Request received', { event });
      // });

      await web3wallet.core.pairing.pair({ uri });
    } else {
      throw new Error('Unsupported WalletConnect version');
    }
  };

  const createConnection = async (url: string) => {
    try {
      logger.info('WalletConnect: Creating connection', { url });
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }

      setConnectionError('');
      setConnectionState(WalletConnectConnectionState.CONNECTING);

      await walletConnectInit(url);

      connectionTimeoutRef.current = setTimeout(() => {
        logger.info(
          'WalletConnect: Connection timeout exceeded, disconnecting...',
          { url },
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

  const approveSessionRequest = async (data: IAccount[]) => {
    if (!proposalRef.current) return;

    const reqNamespaces = buildApprovedNamespaces({
      proposal: proposalRef.current.params,
      supportedNamespaces: {
        eip155: {
          methods: ACCEPTED_CALL_METHODS,
          chains: Object.values(evmCoinList).map(
            item => `eip155:${item.chain}`,
          ),
          events: ['chainChanged', 'accountsChanged'],
          accounts: data.map(
            account =>
              `eip155:${evmCoinList[account.parentAssetId!].chain}${
                account.xpubOrAddress
              }`,
          ),
        },
      },
    });

    const session = await web3WalletRef.current?.approveSession({
      id: proposalRef.current.id,
      namespaces: reqNamespaces,
    });
    setConnectionState(WalletConnectConnectionState.CONNECTED);

    sessionRef.current = session;
  };

  // const onExternalLink = (_event: any, uri: string) => {
  //   logger.info('WalletConnect: Open', { uri });
  //   if (connectionState === WalletConnectConnectionState.NOT_CONNECTED) {
  //     createConnection(uri);
  //   }
  // };

  const getInitialUri = async () => {
    // const uri = await ipcRenderer.invoke('wc-url-init');
    // if (uri) onExternalLink(null, uri);
  };

  React.useEffect(() => {
    // ipcRenderer.on('wallet-connect', onExternalLink);
    getInitialUri();
    return () => {
      // ipcRenderer.removeListener('wallet-connect', onExternalLink);
    };
  }, []);
  const context = useMemo(
    () => ({
      handleClose,
      connectionState,
      createConnection,
      openDialog,
      connectionError,
      selectAccount,
      connectionClientMeta,
      approveCallRequest,
      rejectCallRequest,
      callRequestData,
      selectedAccount,
      selectedWallet,
      setSelectedWallet,
      version,
      requiredNamespaces,
      optionalNamespaces,
      selectedAccountsRef,
      approveSessionRequest,
      errorTitle,
      errorSubtitle,
    }),
    [
      handleClose,
      connectionState,
      createConnection,
      openDialog,
      connectionError,
      selectAccount,
      connectionClientMeta,
      approveCallRequest,
      rejectCallRequest,
      callRequestData,
      selectedAccount,
      selectedWallet,
      setSelectedWallet,
      version,
      requiredNamespaces,
      optionalNamespaces,
      selectedAccountsRef,
      approveSessionRequest,
      errorTitle,
      errorSubtitle,
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
  return React.useContext(WalletConnectContext);
}
