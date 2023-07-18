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
} from '../../AddAccountGuide/Dialogs';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface SendGuideContextInterface {
  tabs: ITabs;
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;
  currentDialog: number;
  setCurrentDialog: Dispatch<SetStateAction<number>>;
  onNext: (tab?: number, dialog?: number) => void;
  onPrevious: () => void;
}

export const SendGuideContext: Context<SendGuideContextInterface> =
  createContext<SendGuideContextInterface>({} as SendGuideContextInterface);

export interface SendGuideContextProviderProps {
  children: ReactNode;
}

export const SendGuideProvider: FC<SendGuideContextProviderProps> = ({
  children,
}) => {
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

  const onNext = (tab?: number, dialog?: number) => {
    logger.info('currentTab');

    if (typeof tab === 'number' && typeof dialog === 'number') {
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
    <SendGuideContext.Provider value={ctx}>
      {children}
    </SendGuideContext.Provider>
  );
};

export function useSendGuide(): SendGuideContextInterface {
  return useContext(SendGuideContext);
}
