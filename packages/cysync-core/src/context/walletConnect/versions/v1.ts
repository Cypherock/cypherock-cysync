import { evmCoinList } from '@cypherock/coins';
import { IAccount } from '@cypherock/db-interfaces';
import WalletConnect from '@walletconnect/legacy-client';
import { useRef } from 'react';

import { getFocusAppMethod } from '~/utils';
import logger from '~/utils/logger';

import {
  ACCEPTED_CALL_METHODS,
  IClientMeta,
  IWalletConnectMethods,
  WalletConnectConnectionState,
  useWalletConnectVersionProps,
} from '../type';

export const useWalletConnectV1 = (props: useWalletConnectVersionProps) => {
  const connectorRef = useRef<WalletConnect | undefined>(undefined);
  const callbacks = {
    handleSessionRequest: (error: Error | null, payload: any) => {
      if (error) {
        logger.error('WalletConnect: Session request error', error);
        return;
      }

      logger.info('WalletConnect: Session request received', payload);
      if (props.connectionTimeoutRef.current) {
        clearTimeout(props.connectionTimeoutRef.current);
      }

      props.setConnectionClientMeta(
        connectorRef.current?.peerMeta ?? undefined,
      );
      props.setConnectionState(WalletConnectConnectionState.SELECT_ACCOUNT);
      props.openDialog();

      getFocusAppMethod()();
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
        getFocusAppMethod()();
        logger.info('WalletConnect: Call Request received', { payload });
        const { params } = payload;
        props.setCallRequestData({
          params,
          id: payload.id,
          method: payload.method,
        });
        return;
      }
      if (payload?.id) {
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
      props.setConnectionState(WalletConnectConnectionState.NOT_CONNECTED);
      props.setConnectionError('');
      props.closeDialog();
    },

    handleConnect: (error: Error | null) => {
      logger.info('WalletConnect: Connected');
      if (error) {
        logger.error(error);
      }
      props.setConnectionState(WalletConnectConnectionState.CONNECTED);
    },
  };

  const methods: IWalletConnectMethods = {
    init: async (uri: string, metadata: IClientMeta) => {
      const connector = new WalletConnect({
        uri,
        clientMeta: metadata,
      });
      connectorRef.current = connector;

      connector.on('session_request', callbacks.handleSessionRequest);
      connector.on('call_request', callbacks.handleCallRequest);
      connector.on('disconnect', callbacks.handleDisconnect);
      connector.on('connect', callbacks.handleConnect);
    },
    disconnect: async () => {
      connectorRef.current?.killSession();
    },
    approveSession: async (accounts: IAccount[]) => {
      const account = accounts[0];
      if (account.familyId !== 'evm')
        throw new Error('Non EVM account in wallet connect');

      const coinMeta = evmCoinList[account.parentAssetId];

      const address = account.xpubOrAddress;

      connectorRef.current?.approveSession({
        accounts: [address],
        chainId: coinMeta.chain,
      });
      props.updateActiveAccount(account);
    },
    approveCall: async (result: string) => {
      if (props.callRequestData?.id)
        connectorRef.current?.approveRequest({
          id: props.callRequestData.id,
          result,
        });
    },
    rejectCall: async (message?: string) => {
      if (props.callRequestData?.id)
        connectorRef.current?.rejectRequest({
          id: props.callRequestData.id,
          error: {
            message: message ?? 'User rejected',
          },
        });
    },
    resetStates: () => {
      connectorRef.current = undefined;
    },
  };

  return methods;
};
