import { logger } from '@cypherock/sdk-core/dist/utils';
import { Core } from '@walletconnect/core';
import { parseUri } from '@walletconnect/utils';
import { Web3Wallet } from '@walletconnect/web3wallet';
import { Web3Wallet as Web3WalletType } from '@walletconnect/web3wallet/dist/types/client';

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

import { selectLanguage, useAppSelector } from '~/store';

import { WalletConnectConnectionState, WalletConnectDapp } from './type';

const CONNECTION_TIMEOUT = 5000;
const WALLET_CONNECT_PROJECT_ID = '892cb46355562fd3e2d37d2361f44c1d';

const cysyncMetadata = {
  description: 'Cypherock CySync',
  url: 'https://www.cypherock.com',
  icons: ['https://www.cypherock.com/assets/logo.png'],
  name: 'Cypherock CySync',
};

export interface WalletConnectContextInterface {
  currentTab: number;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
  currentDialog: number;
  setCurrentDialog: React.Dispatch<React.SetStateAction<number>>;
  connectionError: Error | undefined;
  connectionState: WalletConnectConnectionState;
  createConnection: (uri: string) => Promise<void>;
  dapp: WalletConnectDapp | undefined;
  setDapp: React.Dispatch<React.SetStateAction<WalletConnectDapp | undefined>>;
  supportedNoAccountBlockchain: string[];
  setSupportedNoAccountBlockchain: React.Dispatch<
    React.SetStateAction<string[]>
  >;
}

export const WalletConnectContext: Context<WalletConnectContextInterface> =
  createContext<WalletConnectContextInterface>(
    {} as WalletConnectContextInterface,
  );

export interface WalletConnectProviderProps {
  children: ReactNode;
}

export const WalletConnectProvider: FC<WalletConnectProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.walletConnect.uriTab;
  const [dapp, setDapp] = useState<WalletConnectDapp>();
  const [currentTab, setCurrentTab] = useState(0);
  const [currentDialog, setCurrentDialog] = useState(0);
  const [connectionState, setConnectionState] =
    React.useState<WalletConnectConnectionState>(
      WalletConnectConnectionState.NOT_CONNECTED,
    );
  const [connectionError, setConnectionError] = useState<Error>();

  const currentConnector = useRef<Web3WalletType | undefined>(undefined);
  const connectionTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const [supportedNoAccountBlockchain, setSupportedNoAccountBlockchain] =
    useState<string[]>(['Avalanche C-Chain', 'Solana', 'Binance']);

  const createConnection = async (uri: string) => {
    try {
      logger.info('WalletConnect: Creating connection', { uri });
      if (connectionTimeout.current) {
        clearTimeout(connectionTimeout.current);
      }

      setConnectionState(WalletConnectConnectionState.CONNECTING);
      const { version } = parseUri(uri);
      if (version !== 2) {
        setConnectionError({
          name: lang.strings.sidebar.walletConnect,
          message: strings.unsupportedVersion,
        });
        return;
      }
      const core = new Core({
        projectId: WALLET_CONNECT_PROJECT_ID,
      });

      const web3wallet = await Web3Wallet.init({
        core,
        metadata: cysyncMetadata,
      });

      currentConnector.current = web3wallet;

      await web3wallet.core.pairing.pair({ uri });
      connectionTimeout.current = setTimeout(() => {
        logger.info(
          'WalletConnect: Connection timeout exceeded, disconnecting...',
          { uri },
        );
        setConnectionError({
          name: lang.strings.walletConnect.uriTab.connectionTimeout,
          message: strings.connectionTimeout,
        });
        disconnect();
      }, CONNECTION_TIMEOUT);
    } catch (error) {
      setConnectionState(WalletConnectConnectionState.NOT_CONNECTED);
      setConnectionError({
        name: lang.strings.sidebar.walletConnect,
        message: strings.connectionError,
      });
      if (error) {
        logger.error({ title: lang.strings.sidebar.walletConnect, error });
      }
    }
  };

  const disconnect = () => true;

  const ctx = useMemo(
    () => ({
      currentTab,
      setCurrentTab,
      currentDialog,
      setCurrentDialog,
      connectionError,
      connectionState,
      createConnection,
      dapp,
      setDapp,
      supportedNoAccountBlockchain,
      setSupportedNoAccountBlockchain,
    }),
    [
      currentTab,
      setCurrentTab,
      currentDialog,
      setCurrentDialog,
      connectionError,
      connectionState,
      createConnection,
      dapp,
      setDapp,
      supportedNoAccountBlockchain,
      setSupportedNoAccountBlockchain,
    ],
  );

  return (
    <WalletConnectContext.Provider value={ctx}>
      {children}
    </WalletConnectContext.Provider>
  );
};

export function useWalletConnect(): WalletConnectContextInterface {
  return useContext(WalletConnectContext);
}
