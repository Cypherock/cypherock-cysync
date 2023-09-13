import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { ReleaseNotes } from '../Dialogs';

export interface CySyncVersionDetailsDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
}

export const CySyncVersionDetailsDialogContext: Context<CySyncVersionDetailsDialogContextInterface> =
  createContext<CySyncVersionDetailsDialogContextInterface>(
    {} as CySyncVersionDetailsDialogContextInterface,
  );

export interface CySyncVersionDetailsDialogProviderProps {
  children: ReactNode;
}

export const CySyncVersionDetailsDialogProvider: FC<
  CySyncVersionDetailsDialogProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};

  const onClose = () => {
    dispatch(closeDialog('cySyncVersionDetails'));
  };

  const tabs: ITabs = [
    {
      name: lang.strings.settings.tabs.app.title,
      dialogs: [<ReleaseNotes key="version-details-release-notes" />],
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
    ],
  );

  return (
    <CySyncVersionDetailsDialogContext.Provider value={ctx}>
      {children}
    </CySyncVersionDetailsDialogContext.Provider>
  );
};

export function useCySyncVersionDetailsDialog(): CySyncVersionDetailsDialogContextInterface {
  return useContext(CySyncVersionDetailsDialogContext);
}
