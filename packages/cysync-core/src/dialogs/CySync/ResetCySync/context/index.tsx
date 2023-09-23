import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getResetCySyncMethod } from '~/utils';

import { ConfirmReset } from '../Dialogs';

export interface ResetCySyncDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  onReset: () => Promise<void>;
  isLoading: boolean;
}

export const ResetCySyncDialogContext: Context<ResetCySyncDialogContextInterface> =
  createContext<ResetCySyncDialogContextInterface>(
    {} as ResetCySyncDialogContextInterface,
  );

export interface ResetCySyncDialogProviderProps {
  children: ReactNode;
}

export const ResetCySyncDialogProvider: FC<ResetCySyncDialogProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClose = () => {
    dispatch(closeDialog('resetCySync'));
  };

  const onReset = async () => {
    setIsLoading(true);
    await getResetCySyncMethod()();
    setIsLoading(false);
    onClose();
  };

  const tabs: ITabs = [
    {
      name: lang.strings.settings.tabs.app.title,
      dialogs: [<ConfirmReset key="reset-cysync-confirm" />],
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
      onReset,
      isLoading,
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
      onReset,
      isLoading,
    ],
  );

  return (
    <ResetCySyncDialogContext.Provider value={ctx}>
      {children}
    </ResetCySyncDialogContext.Provider>
  );
};

export function useResetCySyncDialog(): ResetCySyncDialogContextInterface {
  return useContext(ResetCySyncDialogContext);
}
