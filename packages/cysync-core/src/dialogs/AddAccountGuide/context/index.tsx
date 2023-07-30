// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import {
  AddAccountDialog,
  AddAccountSingleChainDialog,
  InitialiseAccountDialog,
  ConnectDevice,
  NoAccountDialog,
  SelectCryptoDialog,
  SyncAccountDialog,
  AddAccountCongrats,
} from '../Dialogs';
import { useTabsAndDialogs } from '~/hooks/useTabsAndDialog';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
  header: string;
}[];

export interface AddAccountDialogContextInterface {
  tabs: ITabs;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
}

export const AddAccountDialogContext: Context<AddAccountDialogContextInterface> =
  createContext<AddAccountDialogContextInterface>(
    {} as AddAccountDialogContextInterface,
  );

export interface AddAccountDialogContextProviderProps {
  children: ReactNode;
}

export const AddAccountDialogProvider: FC<
  AddAccountDialogContextProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const { header } = lang.strings.addAccount;

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {
    1: [0],
  };

  const tabs: ITabs = [
    {
      name: lang.strings.addAccount.aside.tabs.asset,
      dialogs: [<SelectCryptoDialog />],
      header,
    },
    {
      name: lang.strings.addAccount.aside.tabs.device,
      dialogs: [
        <ConnectDevice />,
        <InitialiseAccountDialog />,
        <SyncAccountDialog />,
        <NoAccountDialog />,
        <AddAccountSingleChainDialog />,
        <AddAccountDialog />,
      ],
      header,
    },
    {
      name: lang.strings.addAccount.aside.tabs.confirmation,
      dialogs: [<AddAccountCongrats />],
      header,
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
      currentTab,
      currentDialog,
      tabs,
      onNext,
      onPrevious,
      goTo,
      isDeviceRequired,
    }),
    [
      currentTab,
      currentDialog,
      tabs,
      onNext,
      onPrevious,
      goTo,
      isDeviceRequired,
    ],
  );

  return (
    <AddAccountDialogContext.Provider value={ctx}>
      {children}
    </AddAccountDialogContext.Provider>
  );
};

export function useAddAccountDialog(): AddAccountDialogContextInterface {
  return useContext(AddAccountDialogContext);
}
