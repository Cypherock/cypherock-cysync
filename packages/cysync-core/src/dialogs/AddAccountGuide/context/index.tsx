// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import React, {
  Context,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
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

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface AddAccountDialogContextInterface {
  tabs: ITabs;
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;
  currentDialog: number;
  setCurrentDialog: Dispatch<SetStateAction<number>>;
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
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [currentDialog, setCurrentDialog] = useState<number>(0);

  const tabs: ITabs = [
    {
      name: lang.strings.addAccount.aside.tabs.asset,
      dialogs: [<SelectCryptoDialog />],
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
    },
    {
      name: lang.strings.addAccount.aside.tabs.confirmation,
      dialogs: [<AddAccountCongrats />],
    },
  ];

  const onNext = () => {
    if (currentDialog + 1 > tabs[currentTab].dialogs.length - 1) {
      goToNextTab();
    } else {
      goToNextDialog();
    }
  };

  const goToNextTab = () => {
    setCurrentTab(prevTab => Math.min(tabs.length - 1, prevTab + 1));
    if (currentTab !== tabs.length - 1) {
      setCurrentDialog(0);
    }
  };

  const goToNextDialog = () => {
    setCurrentDialog(prevDialog =>
      Math.min(tabs[currentTab].dialogs.length - 1, prevDialog + 1),
    );
  };

  const goTo = (tab: number, dialog?: number) => {
    setCurrentTab(tab);
    if (dialog !== undefined) {
      setCurrentDialog(dialog);
    } else {
      setCurrentDialog(0);
    }
  };

  const onPrevious = () => {
    if (currentDialog - 1 < 0) {
      if (currentTab === 0) {
        setCurrentDialog(0);
      } else {
        setCurrentDialog(tabs[currentTab - 1].dialogs.length - 1);
        setCurrentTab(prevProps => Math.max(0, prevProps - 1));
      }
    } else {
      setCurrentDialog(prevProps => Math.max(0, prevProps - 1));
    }
  };

  const ctx = useMemo(
    () => ({
      currentTab,
      setCurrentTab,
      currentDialog,
      setCurrentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
    }),
    [
      currentTab,
      setCurrentTab,
      currentDialog,
      setCurrentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
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
