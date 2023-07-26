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
import logger from '~/utils/logger';

import { Receive, ReceiveDevice } from '../Dialogs';
import {
  ReceiveDeviceConfirm,
  ReceiveDeviceConfirmCancelled,
  ReceiveDeviceConfirmForToken,
  ReceiveDeviceConfirmTroubleShoot,
  ReceiveDeviceConnection,
} from '../Dialogs/Device';
import {
  ReceiveAddressNotVerified,
  ReceiveAddressVerified,
  ReceiveVerifyAddress,
} from '../Dialogs/Receive';

type ITabs = {
  name: string;
  dialogs: ReactNode[];
}[];

export interface ReceiveDialogContextInterface {
  tabs: ITabs;
  currentTab: number;
  setCurrentTab: Dispatch<SetStateAction<number>>;
  currentDialog: number;
  setCurrentDialog: Dispatch<SetStateAction<number>>;
  onNext: (tab?: number, dialog?: number) => void;
  onPrevious: () => void;
}

export const ReceiveDialogContext: Context<ReceiveDialogContextInterface> =
  createContext<ReceiveDialogContextInterface>(
    {} as ReceiveDialogContextInterface,
  );

export interface ReceiveDialogContextProviderProps {
  children: ReactNode;
}

export const ReceiveDialogProvider: FC<ReceiveDialogContextProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [currentDialog, setCurrentDialog] = useState<number>(0);

  const tabs: ITabs = [
    {
      name: lang.strings.receive.aside.tabs.source,
      dialogs: [<Receive />],
    },
    {
      name: lang.strings.receive.aside.tabs.device,
      dialogs: [
        <ReceiveDevice />,
        <ReceiveDeviceConnection />,
        <ReceiveDeviceConfirmCancelled />,
        <ReceiveDeviceConfirmTroubleShoot />,
        <ReceiveDeviceConfirmForToken />,
        <ReceiveDeviceConfirm />,
      ],
    },
    {
      name: lang.strings.receive.aside.tabs.receive,
      dialogs: [
        <ReceiveVerifyAddress />,
        <ReceiveAddressNotVerified />,
        <ReceiveAddressVerified />,
      ],
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
    <ReceiveDialogContext.Provider value={ctx}>
      {children}
    </ReceiveDialogContext.Provider>
  );
};

export function useReceiveDialog(): ReceiveDialogContextInterface {
  return useContext(ReceiveDialogContext);
}
