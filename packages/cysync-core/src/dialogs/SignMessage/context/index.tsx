import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useWalletConnect } from '~/context';
import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { ViewMessageDialog, ViewSigningStateDialog } from '../Dialogs';

export interface SignMessageDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  deviceEvents: Record<number, boolean | undefined>;
  setDeviceEvents: React.Dispatch<
    React.SetStateAction<Record<number, boolean | undefined>>
  >;
}

export const SignMessageDialogContext: Context<SignMessageDialogContextInterface> =
  createContext<SignMessageDialogContextInterface>(
    {} as SignMessageDialogContextInterface,
  );

export interface SignMessageDialogProviderProps {
  children: ReactNode;
}

export const SignMessageDialogProvider: FC<SignMessageDialogProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const { rejectCallRequest } = useWalletConnect();

  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};

  const onClose = () => {
    rejectCallRequest();
    dispatch(closeDialog('signMessage'));
  };

  const tabs: ITabs = [
    {
      name: lang.strings.signMessage.title,
      dialogs: [<ViewMessageDialog key="view-message" />],
    },
    {
      name: lang.strings.signMessage.title,
      dialogs: [<ViewSigningStateDialog key="signing" />],
    },
  ];

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
      isDeviceRequired,
      currentTab,
      currentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
      onClose,
      deviceEvents,
      setDeviceEvents,
    }),
    [
      isDeviceRequired,
      currentTab,
      currentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
      onClose,
      deviceEvents,
      setDeviceEvents,
    ],
  );

  return (
    <SignMessageDialogContext.Provider value={ctx}>
      {children}
    </SignMessageDialogContext.Provider>
  );
};

export function useSignMessageDialog(): SignMessageDialogContextInterface {
  return useContext(SignMessageDialogContext);
}
