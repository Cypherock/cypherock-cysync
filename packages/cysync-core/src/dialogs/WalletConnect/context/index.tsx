import { EvmId } from '@cypherock/coins';
import { DropDownListItemProps } from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
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
import { useWalletConnect } from '~/context/walletConnect';
import {
  WalletConnectConnectionState,
  WalletConnectDapp,
} from '~/context/walletConnect/type';

export interface WalletConnectDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  onConnect: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  connectionState: WalletConnectConnectionState;
  selectedWallet: IWallet | undefined;
  handleWalletChange: () => void;
  walletDropdownList: DropDownListItemProps[];
  onPasteWalletConnectedURI: () => void;
  walletConnectURI: string;
  setWalletConnectedURI: React.Dispatch<React.SetStateAction<string>>;
  isValidUri: boolean;
  selectedEvmAccounts: IAccount[];
  selectedEvmAccountsGroup: {
    assetId: EvmId;
    accounts: IAccount[];
  }[];
  evmAccountsGroup: {
    assetId: EvmId;
    accounts: IAccount[];
  }[];
  onChange: (id: string | undefined, assetId: string) => void;
  handleSelectAccount: (id: string) => void;
  handleDeselectAccount: (id: string) => void;
  getBalanceToDisplay: (account: IAccount) => string;
  evmAccountDropdownListGroup: {
    assetId: EvmId;
    accounts: DropDownListItemProps[];
  }[];
  dapp: WalletConnectDapp | undefined;
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
  const { dapp, connectionError, connectionState, createConnection } =
    useWalletConnect();
  const [supportedNoAccountBlockchain, setSupportedNoAccountBlockchain] =
    useState<string[]>(['Avalanche C-Chain', 'Solana', 'Binance']);

  const {
    selectedWallet,
    handleWalletChange,
    walletDropdownList,
    selectedEvmAccounts,
    selectedEvmAccountsGroup,
    onChange,
    getBalanceToDisplay,
    handleSelectAccount,
    handleDeselectAccount,
    evmAccountDropdownListGroup,
    evmAccountsGroup,
  } = useEvmAccountDropdown();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};

  const onClose = () => {
    dispatch(closeDialog('walletConnect'));
  };

  const [isValidUri, setIsValidUri] = useState(false);
  const [errorToShow, setErrorToShow] = useState<Error | undefined>();
  const tabs: ITabs = [
    {
      name: lang.strings.walletConnect.uriTab.title,
      dialogs: [
        <WalletConnectPasteURIDialog key="uriTab" error={errorToShow} />,
      ],
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

  const [walletConnectURI, setWalletConnectedURI] = useState<string>('');

  useEffect(() => {
    if (walletConnectURI.length === 0) {
      setErrorToShow(undefined);
      return;
    }
    const valid = walletConnectURI.startsWith('wc:');
    if (valid) {
      setErrorToShow(undefined);
    } else {
      // user attempted to paste an invalid URI
      setErrorToShow({
        name: lang.strings.sidebar.walletConnect,
        message: lang.strings.walletConnect.uriTab.invalidUri,
      });
    }
    setIsValidUri(valid);
  }, [walletConnectURI]);

  const onPasteWalletConnectedURI = () => {
    navigator.clipboard.readText().then(setWalletConnectedURI);
  };

  const onConnect = async () => {
    // user attempted to connect to the pasted URI
    if (isValidUri) {
      setErrorToShow(undefined);
      await createConnection(walletConnectURI);
      if (WalletConnectConnectionState.SELECT_ACCOUNT === connectionState) {
        onNext();
      } else {
        // could not connect; handle error
        setErrorToShow(connectionError);
      }
    }
  };

  const setUri = async () => {
    const clipboardText = (await navigator.clipboard.readText()).trim();
    // only auto-paste if the clipboard text starts with 'wc:'
    if (clipboardText.startsWith('wc:')) setWalletConnectedURI(clipboardText);
  };

  useEffect(() => {
    // when WalletConnect is opened for the first time, fetch URI from
    // clipboard & paste into UI and context variable
    setUri();
  }, []);

  const ctx = useMemo(
    () => ({
      isDeviceRequired,
      currentTab,
      currentDialog,
      tabs,
      onNext,
      onConnect,
      goTo,
      onPrevious,
      onClose,
      connectionState,
      selectedWallet,
      handleWalletChange,
      walletDropdownList,
      selectedEvmAccounts,
      selectedEvmAccountsGroup,
      onChange,
      getBalanceToDisplay,
      handleSelectAccount,
      handleDeselectAccount,
      evmAccountDropdownListGroup,
      onPasteWalletConnectedURI,
      walletConnectURI,
      setWalletConnectedURI,
      isValidUri,
      evmAccountsGroup,
      dapp,
      supportedNoAccountBlockchain,
      setSupportedNoAccountBlockchain,
    }),
    [
      isDeviceRequired,
      currentTab,
      currentDialog,
      tabs,
      onNext,
      onConnect,
      goTo,
      onPrevious,
      onClose,
      connectionState,
      selectedWallet,
      handleWalletChange,
      walletDropdownList,
      selectedEvmAccounts,
      selectedEvmAccountsGroup,
      onChange,
      getBalanceToDisplay,
      handleSelectAccount,
      handleDeselectAccount,
      evmAccountDropdownListGroup,
      onPasteWalletConnectedURI,
      walletConnectURI,
      setWalletConnectedURI,
      isValidUri,
      evmAccountsGroup,
      dapp,
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
