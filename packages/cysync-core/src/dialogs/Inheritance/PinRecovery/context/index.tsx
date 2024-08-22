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

import { ViewPin, FetchData, SuccessPinRecovery, DecryptPin } from '../Dialogs';

export interface InheritancePinRecoveryDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  unhandledError?: any;
}

export const InheritancePinRecoveryDialogContext: Context<InheritancePinRecoveryDialogContextInterface> =
  createContext<InheritancePinRecoveryDialogContextInterface>(
    {} as InheritancePinRecoveryDialogContextInterface,
  );

export interface InheritancePinRecoveryDialogContextProviderProps {
  children: ReactNode;
}

export const InheritancePinRecoveryDialogProvider: FC<
  InheritancePinRecoveryDialogContextProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        0: [0],
      }),
      [],
    );

  const tabs: ITabs = [
    {
      name: lang.strings.dialogs.inheritancePinRecovery.fetch.name,
      dialogs: [<FetchData key="Fetch data" />],
    },
    {
      name: lang.strings.dialogs.inheritancePinRecovery.decryptPin.name,
      dialogs: [<DecryptPin key="Decrypt pin" />],
    },
    {
      name: lang.strings.dialogs.inheritancePinRecovery.viewPin.name,
      dialogs: [<ViewPin key="View pin" />],
    },
    {
      name: lang.strings.dialogs.inheritancePinRecovery.success.name,
      dialogs: [<SuccessPinRecovery key="Success" />],
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
    dialogName: 'inheritancePinRecovery',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritancePinRecovery'));
  };

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
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
    ],
  );

  return (
    <InheritancePinRecoveryDialogContext.Provider value={ctx}>
      {children}
    </InheritancePinRecoveryDialogContext.Provider>
  );
};

export function useInheritancePinRecoveryDialog(): InheritancePinRecoveryDialogContextInterface {
  return useContext(InheritancePinRecoveryDialogContext);
}
