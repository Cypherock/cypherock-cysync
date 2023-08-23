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

import { useTabsAndDialogs } from '~/hooks/useTabsAndDialogs';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import {
  SelectSend,
  LoadingDialog,
  StandardEthereum,
  StandardOptimism,
  SendConfirmToken,
  SummaryDialog,
  SummaryScrollDialog,
  BitcoinTransaction,
  ConnectDevice,
  SendProblem,
  SendDone,
  SummaryOptimism,
  OptimismVerify,
  SendDeviceConfirmation,
} from '../Dialogs';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface SendDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
}

export const SendDialogContext: Context<SendDialogContextInterface> =
  createContext<SendDialogContextInterface>({} as SendDialogContextInterface);

export interface SendDialogContextProviderProps {
  children: ReactNode;
}

export const SendDialogProvider: FC<SendDialogContextProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {
    1: [0],
  };

  const tabs: ITabs = [
    {
      name: lang.strings.send.aside.tabs.source,
      dialogs: [
        <StandardOptimism />,
        <BitcoinTransaction />,
        <StandardEthereum />,
        <SelectSend />,
      ],
    },
    {
      name: lang.strings.send.aside.tabs.recipient,
      dialogs: [
        <BitcoinTransaction />,
        <StandardEthereum />,
        <StandardOptimism />,
      ],
    },
    {
      name: lang.strings.send.aside.tabs.summary,
      dialogs: [
        <SummaryOptimism />,
        <SummaryDialog />,
        <SummaryScrollDialog />,
      ],
    },
    {
      name: lang.strings.send.aside.tabs.x1vault,
      dialogs: [
        <OptimismVerify />,
        <ConnectDevice />,
        <SendConfirmToken />,
        <SendDeviceConfirmation />,
      ],
    },
    {
      name: lang.strings.send.aside.tabs.confirm,
      dialogs: [<LoadingDialog />, <SendProblem />, <SendDone />],
    },
  ];

  const onClose = () => {
    dispatch(closeDialog('sendDialog'));
  };

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
      onNext,
      onPrevious,
      tabs,
      goTo,
      onClose,
      currentTab,
      currentDialog,
      isDeviceRequired,
    }),
    [
      onNext,
      onPrevious,
      goTo,
      onClose,
      currentTab,
      currentDialog,
      isDeviceRequired,
      tabs,
    ],
  );

  return (
    <SendDialogContext.Provider value={ctx}>
      {children}
    </SendDialogContext.Provider>
  );
};

export function useSendDialog(): SendDialogContextInterface {
  return useContext(SendDialogContext);
}
