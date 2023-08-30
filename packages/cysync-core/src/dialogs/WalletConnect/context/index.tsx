import { EvmId } from '@cypherock/coins';
import { DropDownListItemProps, UniSwapLogo } from '@cypherock/cysync-ui';
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
  WalletConnectAccountConnectedDialog,
  WalletConnectAccountSelectionDialog,
  WalletConnectPasteURIDialog,
} from '../Dialogs';
import { useEvmAccountDropdown } from '../hooks/useEvmAccountDropdown';

export interface WalletConnectDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  selectedWallet: IWallet | undefined;
  setSelectedWallet: React.Dispatch<React.SetStateAction<IWallet | undefined>>;
  handleWalletChange: () => void;
  walletDropdownList: DropDownListItemProps[];
  onPasteWalletConnectedURI: () => void;
  walletConnectURI: string | undefined;
  setWalletConnectedURI: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  selectedEvmAccounts: IAccount[];
  selectedEvmAccountsGroup: {
    assetId: EvmId;
    accounts: IAccount[];
  }[];
  evmAccountsGroup: {
    assetId: EvmId;
    accounts: IAccount[];
  }[];
  setSelectedEvmAccounts: React.Dispatch<React.SetStateAction<IAccount[]>>;
  handleSelectAccount: (id: string) => void;
  handleDisselectAccount: (id: string) => void;
  getBalanceToDisplay: (account: IAccount) => string;
  evmAccountDropdownListGroup: {
    assetId: EvmId;
    accounts: DropDownListItemProps[];
  }[];
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
  supportedNoAccountBlockchain: string[];
  setSupportedNoAccountBlockchain: React.Dispatch<
    React.SetStateAction<string[]>
  >;
}

export const WalletConnectDialogContext: Context<WalletConnectDialogContextInterface> =
  createContext<WalletConnectDialogContextInterface>(
    {} as WalletConnectDialogContextInterface,
  );

export interface WalletConnectDialogProviderProps {
  children: ReactNode;
}

export const WalletConnectDialogProvider: FC<
  WalletConnectDialogProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const [dapp, setDapp] = useState<{
    logo: string;
    url: string;
    name: string;
  }>({
    logo: UniSwapLogo,
    url: 'app.uniswap.org',
    name: 'Uniswap',
  });
  const [supportedNoAccountBlockchain, setSupportedNoAccountBlockchain] =
    useState<string[]>(['Avalanche C-Chain', 'Solana', 'Binance']);

  const {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
    selectedEvmAccounts,
    selectedEvmAccountsGroup,
    setSelectedEvmAccounts,
    getBalanceToDisplay,
    handleSelectAccount,
    handleDisselectAccount,
    evmAccountDropdownListGroup,
    evmAccountsGroup,
  } = useEvmAccountDropdown();

  /** @doubt What is it about? */
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {
    // 1: [0],
    // 2: [0],
  };

  const onClose = () => {
    dispatch(closeDialog('walletConnect'));
  };

  const tabs: ITabs = [
    {
      name: lang.strings.walletConnect.uriTab.title,
      dialogs: [<WalletConnectPasteURIDialog key="uriTab" />],
    },
    {
      name: lang.strings.walletConnect.accountSelectionTab.title,
      dialogs: [
        <WalletConnectAccountSelectionDialog key="accountSelectionTab" />,
      ],
    },
    {
      name: lang.strings.walletConnect.accountConnectedTab.title,
      dialogs: [
        <WalletConnectAccountConnectedDialog key="accountConnectedTab" />,
      ],
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

  const [walletConnectURI, setWalletConnectedURI] = useState<string>();

  const onPasteWalletConnectedURI = () => {
    navigator.clipboard.readText().then(setWalletConnectedURI);
  };

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
      selectedWallet,
      setSelectedWallet,
      handleWalletChange,
      walletDropdownList,
      selectedEvmAccounts,
      selectedEvmAccountsGroup,
      setSelectedEvmAccounts,
      getBalanceToDisplay,
      handleSelectAccount,
      handleDisselectAccount,
      evmAccountDropdownListGroup,
      onPasteWalletConnectedURI,
      walletConnectURI,
      setWalletConnectedURI,
      evmAccountsGroup,
      dapp,
      setDapp,
      supportedNoAccountBlockchain,
      setSupportedNoAccountBlockchain,
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
      selectedWallet,
      setSelectedWallet,
      handleWalletChange,
      walletDropdownList,
      selectedEvmAccounts,
      selectedEvmAccountsGroup,
      setSelectedEvmAccounts,
      getBalanceToDisplay,
      handleSelectAccount,
      handleDisselectAccount,
      evmAccountDropdownListGroup,
      onPasteWalletConnectedURI,
      walletConnectURI,
      setWalletConnectedURI,
      evmAccountsGroup,
      dapp,
      setDapp,
      supportedNoAccountBlockchain,
      setSupportedNoAccountBlockchain,
    ],
  );

  return (
    <WalletConnectDialogContext.Provider value={ctx}>
      {children}
    </WalletConnectDialogContext.Provider>
  );
};

export function useWalletConnectDialog(): WalletConnectDialogContextInterface {
  return useContext(WalletConnectDialogContext);
}
