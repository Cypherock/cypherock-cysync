import { UniSwapLogo } from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import {
  ViewMessageDialog,
  ViewJSONDialog,
  ViewSigningStateDialog,
} from '../Dialogs';

export interface SignMessageDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  message?: string;
  setMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
  json?: string;
  setJson: React.Dispatch<React.SetStateAction<string | undefined>>;
  dapp: {
    logo: string;
    url: string;
    name: string;
  };
  setDapp: React.Dispatch<
    React.SetStateAction<{
      logo: string;
      url: string;
      name: string;
    }>
  >;
  wallet: Pick<IWallet, 'name'>;
  setWallet: React.Dispatch<React.SetStateAction<Pick<IWallet, 'name'>>>;
  account: Pick<IAccount, 'name' | 'familyId' | 'assetId'>;
  setAccount: React.Dispatch<
    React.SetStateAction<Pick<IAccount, 'name' | 'familyId' | 'assetId'>>
  >;
  deviceEvents: Record<number, boolean | undefined>;
  setDeviceEvents: React.Dispatch<
    React.SetStateAction<Record<number, boolean | undefined>>
  >;
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
  const [message, setMessage] = useState<string | undefined>(
    "Consider this scenario:\nA signer called Bob signs a permit to transfer 100 USDC with a router contract as the permissioned spender. The router contract never checks who the caller is but spends any permit messages on the Permit2 contract. An attacker Eve can steal Bob's signature, pass it through to the router with herself as the recipient, and transfer Bob's tokens to herself.\n\nConsider this scenario:\nUniversal Router protects against this by checking that the msg.sender from inside the routing contract is the supposed spender by passing msg.sender in as the owner param in any permit calls and by passing in msg.sender as the from param in any transfer calls.",
  );

  const [json, setJson] = useState<string | undefined>(
    '{"string":"this is a test string","integer":42,"array":[1,2,3,"test",null],"float":3.14159,"object":{"first-child":true,"second-child":false,"last-child":null},"string_number":"1234","date":"2023-08-31T06:00:45.468Z"}',
  );
  const [dapp, setDapp] = useState<{
    logo: string;
    url: string;
    name: string;
  }>({
    logo: UniSwapLogo,
    url: 'app.uniswap.org',
    name: 'Uniswap',
  });

  const [wallet, setWallet] = useState<Pick<IWallet, 'name'>>({
    name: 'Cypherock Red',
  });

  const [account, setAccount] = useState<
    Pick<IAccount, 'name' | 'familyId' | 'assetId'>
  >({
    name: 'Ethereum 1',
    assetId: 'ethereum',
    familyId: 'evm',
  });
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};

  const onClose = () => {
    dispatch(closeDialog('signMessage'));
  };

  const tabs: ITabs = [
    {
      name: lang.strings.signMessage.title,
      dialogs: [<ViewMessageDialog key="view-message" />],
    },
    {
      name: lang.strings.signMessage.title,
      dialogs: [<ViewJSONDialog key="view-json" />],
    },
    {
      name: lang.strings.signMessage.title,
      dialogs: [<ViewSigningStateDialog key="signing" />],
    },
  ];

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
      isDeviceRequired,
      currentTab,
      currentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
      onClose,
      message,
      setMessage,
      json,
      setJson,
      dapp,
      setDapp,
      wallet,
      setWallet,
      account,
      setAccount,
      deviceEvents,
      setDeviceEvents,
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
      message,
      setMessage,
      json,
      setJson,
      dapp,
      setDapp,
      wallet,
      setWallet,
      account,
      setAccount,
      deviceEvents,
      setDeviceEvents,
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
