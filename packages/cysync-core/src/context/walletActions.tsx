import { IWalletActionsTabs } from '@cypherock/cysync-ui';
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
  CardNote,
  ConfirmPin,
  ConfirmWalletName,
  EnterWalletName,
  Instructions,
  SetupWalletPin,
  SuccessMessage,
  TapX1Cards,
  WalletNote,
  WalletPinConsent,
  AddAccount,
  AddAnotherWallet,
} from '~/dialogs/WalletActions/Common';
import {
  ImportWalletCardSafety,
  CountWords,
  EnterSeedPhrase,
  VerifySeedPhrase,
} from '~/dialogs/WalletActions/ImportWallet/Dialogs';

import { selectLanguage, useAppSelector } from '..';

export interface WalletActionsContextInterface {
  importWalletTabs: IWalletActionsTabs;
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;
  currentDialogBox: number;
  setCurrentDialogBox: Dispatch<SetStateAction<number>>;
  setTabs: Dispatch<SetStateAction<IWalletActionsTabs>>;
  onNext: () => void;
  onPrevious: () => void;
}

export const WalletActionsContext: Context<WalletActionsContextInterface> =
  createContext<WalletActionsContextInterface>(
    {} as WalletActionsContextInterface,
  );

export interface WalletActionsContextProviderProps {
  children: ReactNode;
}

export const WalletActionsProvider: FC<WalletActionsContextProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const [tabs, setTabs] = useState<IWalletActionsTabs>([]);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [currentDialogBox, setCurrentDialogBox] = useState<number>(0);

  const commonTabs = {
    device: [
      {
        name: 'instructions',
        component: <Instructions />,
      },
      {
        name: 'enterWalletName',
        component: <EnterWalletName />,
      },
      {
        name: 'confirmWalletName',
        component: <ConfirmWalletName />,
      },
      {
        name: 'walletPinConsent',
        component: <WalletPinConsent />,
      },
      {
        name: 'setupWalletPin',
        component: <SetupWalletPin />,
      },
      {
        name: 'confirmPin',
        component: <ConfirmPin />,
      },
    ],
    syncX1Cards: [
      {
        name: 'tapX1Cards',
        component: <TapX1Cards />,
      },
    ],
    confirmation: {
      walletCreationSuccess: [
        {
          name: 'successMessage',
          component: <SuccessMessage />,
        },
        {
          name: 'walletNote',
          component: <WalletNote />,
        },
        {
          name: 'cardNote',
          component: <CardNote />,
        },
      ],
      finalMessage: [
        {
          name: 'addAnotherWallet',
          component: <AddAnotherWallet />,
        },
        {
          name: 'addAccount',
          component: <AddAccount />,
        },
      ],
    },
  };

  const importWalletTabs: IWalletActionsTabs = [
    {
      name: lang.strings.walletActions.aside.tabs.device,
      dialogs: [
        ...commonTabs.device,
        {
          name: 'countNumberOfWords',
          component: <CountWords />,
        },
        {
          name: 'enterSeedPhrase',
          component: <EnterSeedPhrase />,
        },
        {
          name: 'verifySeedPhrase',
          component: <VerifySeedPhrase />,
        },
      ],
    },
    {
      name: lang.strings.walletActions.aside.tabs.syncX1Cards,
      dialogs: [...commonTabs.syncX1Cards],
    },
    {
      name: lang.strings.walletActions.aside.tabs.confirmation,
      dialogs: [
        ...commonTabs.confirmation.walletCreationSuccess,
        {
          name: 'cardSafety',
          component: <ImportWalletCardSafety />,
        },
        ...commonTabs.confirmation.finalMessage,
      ],
    },
  ];

  const onNext = () => {
    if (currentDialogBox + 1 > tabs[currentTab].dialogs.length - 1) {
      setCurrentTab(prevProps => Math.min(tabs.length - 1, prevProps + 1));
      if (currentTab !== tabs.length - 1) {
        setCurrentDialogBox(0);
      }
    } else {
      setCurrentDialogBox(prevProps =>
        Math.min(tabs[currentTab].dialogs.length - 1, prevProps + 1),
      );
    }
  };

  const onPrevious = () => {
    if (currentDialogBox - 1 < 0) {
      if (currentTab === 0) {
        setCurrentDialogBox(0);
      } else {
        setCurrentDialogBox(tabs[currentTab - 1].dialogs.length - 1);
        setCurrentTab(prevProps => Math.max(0, prevProps - 1));
      }
    } else {
      setCurrentDialogBox(prevProps => Math.max(0, prevProps - 1));
    }
  };

  const ctx = useMemo(
    () => ({
      currentTab,
      setCurrentTab,
      currentDialogBox,
      setCurrentDialogBox,
      tabs,
      importWalletTabs,
      onNext,
      onPrevious,
      setTabs,
    }),
    [
      currentTab,
      setCurrentTab,
      currentDialogBox,
      setCurrentDialogBox,
      tabs,
      importWalletTabs,
      onNext,
      onPrevious,
      setTabs,
    ],
  );

  return (
    <WalletActionsContext.Provider value={ctx}>
      {children}
    </WalletActionsContext.Provider>
  );
};

export function useWalletActions(): WalletActionsContextInterface {
  return useContext(WalletActionsContext);
}
