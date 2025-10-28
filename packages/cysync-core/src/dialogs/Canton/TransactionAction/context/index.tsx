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
import { DeviceAction, SuccessDialogComponent } from '../Dialogs';
import { IAccount } from '@cypherock/db-interfaces';

export enum TransactionActionType {
  CANCEL = 'cancel',
  APPROVE = 'approve',
  REJECT = 'reject',
}

export interface TransactionActionDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  onFinishCreateAccount: () => void;
  onRetry: () => void;
  error: any | undefined;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  transactionActionType: TransactionActionType;
}

export const TransactionActionDialogContext: Context<TransactionActionDialogContextInterface> =
  createContext<TransactionActionDialogContextInterface>(
    {} as TransactionActionDialogContextInterface,
  );

export interface TransactionActionDialogProps {
  selectedAccount?: IAccount;
  transactionActionType: TransactionActionType;
}

export interface TransactionActionDialogContextProviderProps
  extends TransactionActionDialogProps {
  children: ReactNode;
}

export const TransactionActionDialogProvider: FC<
  TransactionActionDialogContextProviderProps
> = ({ children, selectedAccount, transactionActionType }) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.cantonDialogs.transactionAction.dialogs;
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        7: [0],
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
    dispatch(closeDialog('transactionActionDialog'));
  };

  const onRetry = () => {
    setError(undefined);
  };

  const onFinishCreateAccount = async () => {
    console.log('selectedAccount', selectedAccount);
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
    dialogName: 'transactionActionDialog',
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
    onFinishCreateAccount,
    transactionActionType,
  });

  return (
    <TransactionActionDialogContext.Provider value={ctx}>
      {children}
    </TransactionActionDialogContext.Provider>
  );
};

export function useTransactionActionDialog(): TransactionActionDialogContextInterface {
  return useContext(TransactionActionDialogContext);
}

TransactionActionDialogProvider.defaultProps = {
  selectedAccount: undefined,
};
