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

export interface ReleaseNotesDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
}

export const ReleaseNotesDialogContext: Context<ReleaseNotesDialogContextInterface> =
  createContext<ReleaseNotesDialogContextInterface>(
    {} as ReleaseNotesDialogContextInterface,
  );

export interface ReleaseNotesDialogProviderProps {
  children: ReactNode;
}

export const ReleaseNotesDialogProvider: FC<
  ReleaseNotesDialogProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};

  const onClose = () => {
    dispatch(closeDialog('releaseNotes'));
  };

  const tabs: ITabs = [
    {
      name: lang.strings.settings.tabs.app.title,
      dialogs: [<ReleaseNotes key="release-notes" />],
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
    <ReleaseNotesDialogContext.Provider value={ctx}>
      {children}
    </ReleaseNotesDialogContext.Provider>
  );
};

export function useReleaseNotesDialog(): ReleaseNotesDialogContextInterface {
  return useContext(ReleaseNotesDialogContext);
}
