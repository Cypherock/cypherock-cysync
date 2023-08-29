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
  WalletConnectURLDialog,
} from '../Dialogs';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { DropDownListItemProps } from '@cypherock/cysync-ui';
import { useEthAccountDropdown } from '../hooks/useEthAccountDropdown';
import { EvmId } from '@cypherock/coins';

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
  setSelectedEvmAccounts: React.Dispatch<React.SetStateAction<IAccount[]>>;
  handleSelectAccount: (id: string) => void;
  handleDisselectAccount: (id: string) => void;
  getBalanceToDisplay: (account: IAccount) => string;
  evmAccountDropdownListGroup: {
    assetId: EvmId;
    accounts: DropDownListItemProps[];
  }[];
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
  } = useEthAccountDropdown();

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
      name: lang.strings.walletConnect.urlTab.title,
      dialogs: [<WalletConnectURLDialog key="urlTab" />],
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

  /** @throws Navigator Permission Denied Exception */
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
