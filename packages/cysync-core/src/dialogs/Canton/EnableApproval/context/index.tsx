// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import { LoaderDialog } from '~/components';
import { ITabs, useMemoReturn, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { keyValueStore } from '~/utils';
import { DeviceAction, SuccessDialogComponent } from '../Dialogs';
import { IAccount } from '@cypherock/db-interfaces';

export interface EnableApprovalDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  onFinishEnableApproval: () => void;
  onRetry: () => void;
  error: any | undefined;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
}

export const EnableApprovalDialogContext: Context<EnableApprovalDialogContextInterface> =
  createContext<EnableApprovalDialogContextInterface>(
    {} as EnableApprovalDialogContextInterface,
  );

export interface EnableApprovalDialogProps {
  selectedAccount?: IAccount;
}

export interface EnableApprovalDialogContextProviderProps
  extends EnableApprovalDialogProps {
  children: ReactNode;
}

export const EnableApprovalDialogProvider: FC<
  EnableApprovalDialogContextProviderProps
> = ({ children, selectedAccount }) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.cantonDialogs.enableApproval.dialogs;
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        0: [0],
      }),
      [],
    );

  const [error, setError] = useState<any | undefined>();

  const tabs: ITabs = useMemo(
    () => [
      {
        name: strings.x1Vault.name,
        dialogs: [<DeviceAction />],
      },
      {
        name: strings.confirmation.name,
        dialogs: [<LoaderDialog />],
      },
      {
        name: '',
        dialogs: [<SuccessDialogComponent />],
        dontShowOnMilestone: true,
      },
    ],
    [lang],
  );

  const onClose = async () => {
    dispatch(closeDialog('enableApprovalDialog'));
  };

  const onRetry = () => {
    setError(undefined);
  };

  const onFinishEnableApproval = async () => {
    console.log('selectedAccount', selectedAccount);
    await keyValueStore.isAutomaticApprovalsEnabled.set(true);
    onClose();
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
    dialogName: 'enableApprovalDialog',
  });

  const ctx = useMemoReturn({
    onNext,
    onPrevious,
    tabs,
    goTo,
    onClose,
    currentTab,
    currentDialog,
    isDeviceRequired,
    error,
    onRetry,
    onFinishEnableApproval,
  });

  return (
    <EnableApprovalDialogContext.Provider value={ctx}>
      {children}
    </EnableApprovalDialogContext.Provider>
  );
};

export function useEnableApprovalDialog(): EnableApprovalDialogContextInterface {
  return useContext(EnableApprovalDialogContext);
}

EnableApprovalDialogProvider.defaultProps = {
  selectedAccount: undefined,
};
