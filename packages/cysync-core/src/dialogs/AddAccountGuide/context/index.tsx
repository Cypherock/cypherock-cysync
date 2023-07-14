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

import logger from '~/utils/logger';

import {
  AddAccountDialog,
  AddAccountSingleChainDialog,
  InitialiseAccountDialog,
  ConnectDevice,
  NoAccountDialog,
  SelectCryptoDialog,
  SyncAccountDialog,
  selectLanguage,
  useAppSelector,
  AddAccountCongrats,
} from '../../..';
import { SuccessMessage } from '~/dialogs/CreateWalletGuide/Dialogs';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface AddAccountGuideContextInterface {
  tabs: ITabs;
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;
  currentDialog: number;
  setCurrentDialog: Dispatch<SetStateAction<number>>;
  onNext: (tab?: number, dialog?: number) => void;
  onPrevious: () => void;
}

export const AddAccountGuideContext: Context<AddAccountGuideContextInterface> =
  createContext<AddAccountGuideContextInterface>(
    {} as AddAccountGuideContextInterface,
  );

export interface AddAccountGuideContextProviderProps {
  children: ReactNode;
}

export const AddAccountGuideProvider: FC<
  AddAccountGuideContextProviderProps
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
      dialogs: [<SuccessMessage />, <AddAccountCongrats />],
    },
  ];

  const onNext = (tab?: number, dialog?: number) => {
    logger.info('currentTab');

    if (tab && dialog) {
      console.log('tab', tab);
      console.log('dialog', dialog);
      setCurrentTab(tab);
      setCurrentDialog(dialog);
    } else if (currentDialog + 1 > tabs[currentTab].dialogs.length - 1) {
      setCurrentTab(prevProps => Math.min(tabs.length - 1, prevProps + 1));
      if (currentTab !== tabs.length - 1) {
        setCurrentDialog(0);
      }
    } else {
      setCurrentDialog(prevProps =>
        Math.min(tabs[currentTab].dialogs.length - 1, prevProps + 1),
      );
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
      onPrevious,
    }),
    [
      currentTab,
      setCurrentTab,
      currentDialog,
      setCurrentDialog,
      tabs,
      onNext,
      onPrevious,
    ],
  );

  return (
    <AddAccountGuideContext.Provider value={ctx}>
      {children}
    </AddAccountGuideContext.Provider>
  );
};

export function useAddAccountGuide(): AddAccountGuideContextInterface {
  return useContext(AddAccountGuideContext);
}
