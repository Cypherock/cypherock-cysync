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

import {
  AddAccount,
  AddAnotherWallet,
  CardNote,
  CardSafety,
  ConfirmPin,
  ConfirmWalletName,
  EnterWalletName,
  Instructions,
  SetupWalletPin,
  SuccessMessage,
  TapX1Cards,
  WalletNote,
  WalletPinConsent,
} from '~/dialogs/ImportWalletGuide/Dialogs';

import { selectLanguage, useAppSelector } from '../../..';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface ImportWalletGuideContextInterface {
  tabs: ITabs;
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;
  currentDialog: number;
  setCurrentDialog: Dispatch<SetStateAction<number>>;
  onNext: () => void;
  onPrevious: () => void;
}

export const ImportWalletGuideContext: Context<ImportWalletGuideContextInterface> =
  createContext<ImportWalletGuideContextInterface>(
    {} as ImportWalletGuideContextInterface,
  );

export interface ImportWalletGuideContextProviderProps {
  children: ReactNode;
}

export const ImportWalletGuideProvider: FC<
  ImportWalletGuideContextProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [currentDialog, setCurrentDialog] = useState<number>(0);

  const tabs: ITabs = [
    {
      name: lang.strings.importWallet.aside.tabs.device,
      dialogs: [
        <Instructions />,
        <EnterWalletName />,
        <ConfirmWalletName />,
        <WalletPinConsent />,
        <SetupWalletPin />,
        <ConfirmPin />,
      ],
    },
    {
      name: lang.strings.importWallet.aside.tabs.syncX1Cards,
      dialogs: [<TapX1Cards />],
    },
    {
      name: lang.strings.importWallet.aside.tabs.confirmation,
      dialogs: [
        <SuccessMessage />,
        <WalletNote />,
        <CardNote />,
        <CardSafety />,
        <AddAnotherWallet />,
        <AddAccount />,
      ],
    },
  ];

  const onNext = () => {
    if (currentDialog + 1 > tabs[currentTab].dialogs.length - 1) {
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
    <ImportWalletGuideContext.Provider value={ctx}>
      {children}
    </ImportWalletGuideContext.Provider>
  );
};

export function useImportWalletGuide(): ImportWalletGuideContextInterface {
  return useContext(ImportWalletGuideContext);
}
