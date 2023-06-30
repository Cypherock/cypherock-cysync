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
import { ITabs } from '@cypherock/cysync-ui';
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
} from '~/pages/OnBoarding/Wallet/CreateNewWallet/Dialogs';
import { selectLanguage, useAppSelector } from '..';

export interface CreateNewWalletContextInterface {
  tabs: ITabs;
  tab: number;
  setTab: Dispatch<SetStateAction<number>>;
  dialogBox: number;
  setDialogBox: Dispatch<SetStateAction<number>>;
  showWalletActionsDialogBox: boolean;
  setShowWalletActionsDialogBox: Dispatch<SetStateAction<boolean>>;
  showCreateWalletDialogBox: boolean;
  setShowCreateWalletDialogBox: Dispatch<SetStateAction<boolean>>;
  onNext: () => void;
  onPrevious: () => void;
}

export const CreateNewWalletContext: Context<CreateNewWalletContextInterface> =
  createContext<CreateNewWalletContextInterface>(
    {} as CreateNewWalletContextInterface,
  );

export interface CreateNewWalletContextProviderProps {
  children: ReactNode;
}

export const CreateNewWalletProvider: FC<
  CreateNewWalletContextProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const [tab, setTab] = useState<number>(0);
  const [dialogBox, setDialogBox] = useState<number>(0);
  const [showWalletActionsDialogBox, setShowWalletActionsDialogBox] =
    useState<boolean>(true);
  const [showCreateWalletDialogBox, setShowCreateWalletDialogBox] =
    useState<boolean>(false);

  const tabs: ITabs = [
    {
      name: lang.strings.onboarding.createWallet.aside.tabs.device,
      dialogs: [
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
    },
    {
      name: lang.strings.onboarding.createWallet.aside.tabs.syncX1Cards,
      dialogs: [
        {
          name: 'tapX1Cards',
          component: <TapX1Cards />,
        },
      ],
    },
    {
      name: lang.strings.onboarding.createWallet.aside.tabs.confirmation,
      dialogs: [
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
        {
          name: 'cardSafety',
          component: <CardSafety />,
        },
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
  ];

  const onNext = () => {
    if (dialogBox + 1 > tabs[tab].dialogs.length - 1) {
      setTab(prevProps => Math.min(tabs.length - 1, prevProps + 1));
      if (tab !== tabs.length - 1) {
        setDialogBox(0);
      }
    } else {
      setDialogBox(prevProps =>
        Math.min(tabs[tab].dialogs.length - 1, prevProps + 1),
      );
    }
  };

  const onPrevious = () => {
    if (dialogBox - 1 < 0) {
      if (tab === 0) {
        setDialogBox(0);
      } else {
        setDialogBox(tabs[tab - 1].dialogs.length - 1);
        setTab(prevProps => Math.max(0, prevProps - 1));
      }
    } else {
      setDialogBox(prevProps => Math.max(0, prevProps - 1));
    }
  };

  const ctx = useMemo(
    () => ({
      tab,
      setTab,
      dialogBox,
      setDialogBox,
      tabs,
      onNext,
      onPrevious,
      showCreateWalletDialogBox,
      showWalletActionsDialogBox,
      setShowCreateWalletDialogBox,
      setShowWalletActionsDialogBox,
    }),
    [
      tab,
      setTab,
      dialogBox,
      setDialogBox,
      tabs,
      onNext,
      onPrevious,
      showCreateWalletDialogBox,
      showWalletActionsDialogBox,
      setShowCreateWalletDialogBox,
      setShowWalletActionsDialogBox,
    ],
  );

  return (
    <CreateNewWalletContext.Provider value={ctx}>
      {children}
    </CreateNewWalletContext.Provider>
  );
};

export function useCreateNewWallet(): CreateNewWalletContextInterface {
  return useContext(CreateNewWalletContext);
}
