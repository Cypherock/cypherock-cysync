import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
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

export interface WalletConnectDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  // error: any | undefined;
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
