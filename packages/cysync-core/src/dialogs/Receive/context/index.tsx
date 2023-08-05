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

import { Receive } from '../Dialogs';
import {
  ReceiveDeviceConfirm,
  ReceiveDeviceConfirmForToken,
  ReceiveDeviceConfirmTroubleShoot,
  ReceiveDeviceConnection,
} from '../Dialogs/Device';
import { ReceiveDeviceTroubleshoot } from '../Dialogs/Device/ReceiveDeviceTroubleshoot';
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
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
  onClose: () => void;
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
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {
    1: [0],
  };

  const tabs: ITabs = [
    {
      name: lang.strings.receive.aside.tabs.source,
      dialogs: [<Receive />],
    },
    {
      name: lang.strings.receive.aside.tabs.device,
      dialogs: [
        <ReceiveDeviceTroubleshoot />,
        <ReceiveDeviceConnection />,
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

  const onClose = () => {
    dispatch(closeDialog('receiveDialog'));
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
      onClose,
      goTo,
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
    <ReceiveDialogContext.Provider value={ctx}>
      {children}
    </ReceiveDialogContext.Provider>
  );
};

export function useReceiveDialog(): ReceiveDialogContextInterface {
  return useContext(ReceiveDialogContext);
}
