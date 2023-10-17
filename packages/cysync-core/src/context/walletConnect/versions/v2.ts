import { evmCoinList } from '@cypherock/coins';
import { parseLangTemplate } from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import { SessionTypes } from '@walletconnect/types';
import {
  buildApprovedNamespaces,
  getSdkError,
  normalizeNamespaces,
} from '@walletconnect/utils';
import { Web3WalletTypes } from '@walletconnect/web3wallet';
import { Web3Wallet as Web3WalletType } from '@walletconnect/web3wallet/dist/types/client';
import { useRef, useState } from 'react';

import { constants } from '~/constants';
import { useStateWithRef } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import {
  getFocusAppMethod,
  getWalletConnect,
  getWalletConnectCore,
} from '~/utils';
import logger from '~/utils/logger';

import {
  ACCEPTED_CALL_METHODS,
  IClientMeta,
  IWalletConnectMethods,
  WalletConnectConnectionState,
  useWalletConnectVersionProps,
} from '../type';

const WALLET_CONNECT_PROJECT_ID = constants.walletConnectProjectId;

export const useWalletConnectV2 = (props: useWalletConnectVersionProps) => {
  const lang = useAppSelector(selectLanguage);
  const [requiredNamespaces, setRequiredNamespaces] = useState<string[]>([]);
  const [optionalNamespaces, setOptionalNamespaces] = useState<string[]>([]);
  const [
    unsupportedOptionalChainsMessage,
    setUnsupportedOptionalChainsMessage,
  ] = useState<string | undefined>();
  const [selectedAccounts, setSelectedAccounts, selectedAccountsRef] =
    useStateWithRef<IAccount[]>([]);
  const web3WalletRef = useRef<Web3WalletType | undefined>(undefined);
  const proposalRef = useRef<Web3WalletTypes.SessionProposal | undefined>(
    undefined,
  );
  const sessionRef = useRef<SessionTypes.Struct | undefined>(undefined);

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
      .flat()
      .filter(namespace => !!namespace) as string[];

    const supportedNamespaces = Object.values(evmCoinList).map(
      item => `eip155:${item.chain}`,
    );
    const unsupportedChains = requiredChains.filter(
      chain => chain && !supportedNamespaces.includes(chain),
    );
    const listToWords = (list: string[]) => {
      if (list.length <= 1) {
        return list[0];
      }
      const last = list[list.length - 1];
      const newList = list.slice(0, list.length - 1);
      return `${newList.join(', ')} and ${last}`;
    };

    if (unsupportedChains.length === 0) {
      const supportedOptionalChains = supportedNamespaces
        .filter(chain => !requiredChains.includes(chain))
        .filter(chain => optionalChains.includes(chain));
      const unsupportedOptionalChains = optionalChains
        .filter(chain => !requiredChains.includes(chain))
        .filter(chain => !supportedNamespaces.includes(chain));
      setRequiredNamespaces(requiredChains);
      setOptionalNamespaces(supportedOptionalChains);
      setUnsupportedOptionalChainsMessage(
        listToWords(unsupportedOptionalChains),
      );
      return true;
    }
    await web3WalletRef.current?.rejectSession({
      id: proposal.id,
      reason: getSdkError('UNSUPPORTED_CHAINS'),
    });

    const supportedChainNames = Object.values(evmCoinList).map(
      item => item.name,
    );

    props.setErrorTitle(
      parseLangTemplate(
        lang.strings.walletConnect.common.error.unsupportedChains.title,
        {
          dappName: proposal.params.proposer.metadata.name,
          s: unsupportedChains.length > 1 ? 's' : '',
        },
      ),
    );

    props.setErrorSubtitle(
      parseLangTemplate(
        lang.strings.walletConnect.common.error.unsupportedChains.subtitle,
        {
          chains: listToWords(supportedChainNames),
        },
      ),
    );
    props.setConnectionError(
      parseLangTemplate(
        lang.strings.walletConnect.common.error.unsupportedChains.message,
        {
          chains: listToWords(unsupportedChains),
        },
      ),
    );

    props.setConnectionState(WalletConnectConnectionState.CONNECTION_ERROR);
    props.openDialog();

    logger.info('WalletConnect: Rejected due to unsupported chains');
    return false;
  };

  const callbacks = {
    handleSessionProposal: async (
      proposal: Web3WalletTypes.SessionProposal,
    ) => {
      logger.info('WalletConnect: Session proposal received', proposal);

      proposalRef.current = proposal;

      if (props.connectionTimeoutRef.current) {
        clearTimeout(props.connectionTimeoutRef.current);
      }

      if (!(await areChainsSupported(proposal))) return;

      props.setConnectionClientMeta(proposal.params.proposer.metadata);
      props.setConnectionState(WalletConnectConnectionState.SELECT_ACCOUNT);
      props.openDialog();
      getFocusAppMethod()();
    },
    handleSessionDelete: async () => {
      props.setConnectionState(WalletConnectConnectionState.NOT_CONNECTED);
      props.setConnectionError('');
      props.closeDialog();
    },
    handleSessionRequest: async (event: any) => {
      // only works when only one account per chain is selected, chainId is different then chain
      const account = selectedAccountsRef.current.find(
        acc =>
          evmCoinList[acc.parentAssetId].chain.toString() ===
          event.params.chainId.split(':')[1],
      );
      props.updateActiveAccount(account);
      props.setCallRequestData({
        id: event.id,
        topic: event.topic,
        params: event.params.request.params,
        method: event.params.request.method as any,
      });
      getFocusAppMethod()();
      logger.info('WalletConnect: Call Request received', { event });
    },
  };

  const methods: IWalletConnectMethods = {
    init: async (uri: string, metadata: IClientMeta) => {
      const { Core } = getWalletConnectCore();
      const { Web3Wallet } = getWalletConnect();

      const core = new Core({
        projectId: WALLET_CONNECT_PROJECT_ID,
      });

      const web3wallet = await Web3Wallet.init({
        core,
        metadata,
      });

      web3WalletRef.current = web3wallet;

      web3wallet.on('session_proposal', callbacks.handleSessionProposal);
      web3wallet.on('session_delete', callbacks.handleSessionDelete);
      web3wallet.on('session_request', callbacks.handleSessionRequest);

      await web3wallet.pair({ uri });
    },
    disconnect: async () => {
      if (
        props.connectionState === WalletConnectConnectionState.CONNECTED &&
        sessionRef.current
      ) {
        await web3WalletRef.current?.disconnectSession({
          topic: sessionRef.current.topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });
      } else if (
        props.connectionState !==
          WalletConnectConnectionState.CONNECTION_ERROR &&
        proposalRef.current
      ) {
        await web3WalletRef.current?.rejectSession({
          id: proposalRef.current.id,
          reason: getSdkError('USER_REJECTED'),
        });
      }
    },
    approveSession: async (accounts: IAccount[]) => {
      if (!proposalRef.current || accounts.length < 1) return;

      const uniqueChains = Array.from(
        new Set(
          accounts.map(
            account => `eip155:${evmCoinList[account.parentAssetId].chain}`,
          ),
        ),
      );
      const parsedAccounts = accounts.map(
        account =>
          `eip155:${evmCoinList[account.parentAssetId].chain}:${
            account.xpubOrAddress
          }`,
      );

      const reqNamespaces = buildApprovedNamespaces({
        proposal: proposalRef.current.params,
        supportedNamespaces: {
          eip155: {
            methods: ACCEPTED_CALL_METHODS,
            chains: uniqueChains,
            events: ['chainChanged', 'accountsChanged'],
            accounts: parsedAccounts,
          },
        },
      });
      const obj = {
        id: proposalRef.current.id,
        namespaces: reqNamespaces,
      };
      const session = await web3WalletRef.current?.approveSession(obj);
      props.setConnectionState(WalletConnectConnectionState.CONNECTED);
      sessionRef.current = session;
      setSelectedAccounts(accounts);
      props.updateActiveAccount(accounts[0]);
    },
    approveCall: async (result: string) => {
      if (!props.callRequestData?.topic) return;
      await web3WalletRef.current?.respondSessionRequest({
        topic: props.callRequestData.topic,
        response: {
          id: props.callRequestData.id,
          jsonrpc: '2.0',
          result,
        },
      });
    },
    rejectCall: async (message?: string) => {
      if (!props.callRequestData?.topic) return;
      await web3WalletRef.current?.respondSessionRequest({
        topic: props.callRequestData.topic,
        response: {
          id: props.callRequestData.id,
          jsonrpc: '2.0',
          error: {
            code: 5000,
            message: message ?? lang.strings.walletConnect.common.reject.call,
          },
        },
      });
    },
    resetStates: () => {
      setRequiredNamespaces([]);
      setOptionalNamespaces([]);
      web3WalletRef.current = undefined;
      proposalRef.current = undefined;
      setSelectedAccounts([]);
    },
  };

  return {
    methods,
    requiredNamespaces,
    optionalNamespaces,
    unsupportedOptionalChainsMessage,
    selectedAccounts,
  };
};
