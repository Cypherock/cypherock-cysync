import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';

import { ITabs, useMemoReturn, useTabsAndDialogs } from '~/hooks';
import { inheritanceLoginService, inheritancePlanService } from '~/services';
import {
  closeDialog,
  reminderPeriodNumToStringMap,
  reminderPeriodStringToNumMap,
  useAppDispatch,
} from '~/store';

import { useAuthTokenConfig } from '../../hooks/useAuthConfig';
import { useCaptureUnhandledErrors } from '../../hooks/useCatpureUnhandledErrors';
import { useUpdatePlanDetails } from '../../hooks/useUpdatePlanDetails';
import { FetchData, ReminderSetup, Success } from '../Dialogs';

export interface InheritanceEditReminderTimeDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  unhandledError?: any;
  fetchData: () => void;
  updateData: (n: number) => void;
  reminder?: number;
  onRetry?: () => void;
}

export const InheritanceEditReminderTimeDialogContext: Context<InheritanceEditReminderTimeDialogContextInterface> =
  createContext<InheritanceEditReminderTimeDialogContextInterface>(
    {} as InheritanceEditReminderTimeDialogContextInterface,
  );

export interface InheritanceEditReminderTimeDialogProps {
  walletId: string;
}

export interface InheritanceEditReminderTimeDialogContextProviderProps
  extends InheritanceEditReminderTimeDialogProps {
  children: ReactNode;
}

export const InheritanceEditReminderTimeDialogProvider: FC<
  InheritanceEditReminderTimeDialogContextProviderProps
> = ({ children, walletId }) => {
  const dispatch = useAppDispatch();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const tabs: ITabs = [
    {
      name: 'Fetch Data',
      dialogs: [<FetchData key="FetchData" />],
    },
    {
      name: 'Reminder Setup',
      dialogs: [<ReminderSetup key="ReminderSetup" />],
    },
    {
      name: 'Success Message',
      dialogs: [<Success key="Success" />],
    },
  ];

  const [reminder, setReminder] = useState<number>();
  const { unhandledError, setUnhandledError, captureErrors } =
    useCaptureUnhandledErrors();

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
    dialogName: 'inheritanceEditReminderTime',
  });

  const { authTokenConfig } = useAuthTokenConfig({
    walletId,
    authType: 'SEED',
  });
  const { fetchAndUpdatePlan } = useUpdatePlanDetails({ authTokenConfig });

  const onClose = () => {
    fetchAndUpdatePlan();
    dispatch(closeDialog('inheritanceEditReminderTime'));
  };

  const onRetry = () => {
    setUnhandledError(undefined);
    goTo(0, 0);
  };

  const fetchData = captureErrors(async () => {
    const result = await inheritancePlanService.getPlan({ authTokenConfig });

    const reminderValue =
      reminderPeriodStringToNumMap[
        result.result?.emailConfig?.frequency ?? ''
      ] ?? 1;

    setReminder(reminderValue);
    onNext();
  });

  const updateData = captureErrors(async (newDuration: number) => {
    const frequency = reminderPeriodNumToStringMap[newDuration] ?? 'monthly';

    const result = await inheritanceLoginService.updateReminder({
      frequency,
      authTokenConfig,
    });

    if (result.error) {
      throw result.error ?? "Couldn't update reminder";
    }

    setReminder(newDuration);
    onNext();
  });

  const ctx = useMemoReturn({
    onNext,
    onPrevious,
    tabs,
    onClose,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
    fetchData,
    updateData,
    reminder,
    unhandledError,
    onRetry,
  });

  return (
    <InheritanceEditReminderTimeDialogContext.Provider value={ctx}>
      {children}
    </InheritanceEditReminderTimeDialogContext.Provider>
  );
};

export function useInheritanceEditReminderTimeDialog(): InheritanceEditReminderTimeDialogContextInterface {
  return useContext(InheritanceEditReminderTimeDialogContext);
}
