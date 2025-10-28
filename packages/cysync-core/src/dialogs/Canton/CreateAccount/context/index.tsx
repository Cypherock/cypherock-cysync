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
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { AutomaticApprovalDialog } from '../Dialogs/AutomaticApproval';

export interface CreateCantonAccountDialogContextInterface {
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
  selectedAccount: IAccount | undefined;
  deviceEvents: Record<number, boolean | undefined>;
  selectedWallet: IWallet | undefined;
}

export const CreateCantonAccountDialogContext: Context<CreateCantonAccountDialogContextInterface> =
  createContext<CreateCantonAccountDialogContextInterface>(
    {} as CreateCantonAccountDialogContextInterface,
  );

export interface CreateCantonAccountDialogProps {
  selectedAccount?: IAccount;
}

export interface CreateCantonAccountDialogContextProviderProps
  extends CreateCantonAccountDialogProps {
  children: ReactNode;
}

export const CreateCantonAccountDialogProvider: FC<
  CreateCantonAccountDialogContextProviderProps
> = ({ children, selectedAccount }) => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.cantonDialogs.createCantonAccount.dialogs;
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        0: [0],
      }),
      [],
    );

  const [error, setError] = useState<any | undefined>();
  const [deviceEvents] = useState<Record<number, boolean | undefined>>({});
  const [selectedWallet] = useState<IWallet | undefined>();

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
      {
        name: strings.automaticApproval.name,
        dialogs: [<AutomaticApprovalDialog />],
      },
    ],
    [lang],
  );

  const onClose = async () => {
    dispatch(closeDialog('createCantonAccountDialog'));
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
    dialogName: 'createCantonAccountDialog',
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
    selectedAccount,
    deviceEvents,
    selectedWallet,
  });

  return (
    <CreateCantonAccountDialogContext.Provider value={ctx}>
      {children}
    </CreateCantonAccountDialogContext.Provider>
  );
};

export function useCreateCantonAccountDialog(): CreateCantonAccountDialogContextInterface {
  return useContext(CreateCantonAccountDialogContext);
}

CreateCantonAccountDialogProvider.defaultProps = {
  selectedAccount: undefined,
};
