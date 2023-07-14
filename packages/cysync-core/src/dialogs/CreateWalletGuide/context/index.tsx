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
} from '~/dialogs/CreateWalletGuide/Dialogs';

import { selectLanguage, useAppSelector } from '../../..';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface CreateWalletGuideContextInterface {
  tabs: ITabs;
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;
  currentDialog: number;
  setCurrentDialog: Dispatch<SetStateAction<number>>;
  onNext: () => void;
  onPrevious: () => void;
}

export const CreateWalletGuideContext: Context<CreateWalletGuideContextInterface> =
  createContext<CreateWalletGuideContextInterface>(
    {} as CreateWalletGuideContextInterface,
  );

export interface CreateWalletGuideContextProviderProps {
  children: ReactNode;
}

export const CreateWalletGuideProvider: FC<
  CreateWalletGuideContextProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [currentDialog, setCurrentDialog] = useState<number>(0);

  const tabs: ITabs = [
    {
      name: lang.strings.onboarding.createWallet.aside.tabs.device,
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
      name: lang.strings.onboarding.createWallet.aside.tabs.syncX1Cards,
      dialogs: [<TapX1Cards />],
    },
    {
      name: lang.strings.onboarding.createWallet.aside.tabs.confirmation,
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
    <CreateWalletGuideContext.Provider value={ctx}>
      {children}
    </CreateWalletGuideContext.Provider>
  );
};

export function useCreateWalletGuide(): CreateWalletGuideContextInterface {
  return useContext(CreateWalletGuideContext);
}
