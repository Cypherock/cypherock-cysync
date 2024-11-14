import { sleep } from '@cypherock/sdk-utils';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import { closeDialog, useAppDispatch } from '~/store';

import {
  InheritanceEditUserDetailsUserType,
  InheritanceEditUserDetailsDialogProps,
} from '..';
import { EditDetails, Success, VerifyOTP } from '../Dialogs';

export interface IUserDetails {
  name: string;
  email: string;
  alternateEmail: string;
}

export interface InheritanceEditUserDetailsDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  unhandledError?: any;
  userDetails?: IUserDetails;
  onUserDetailsSubmit: (params: IUserDetails) => void;
  isSubmittingUserDetails: boolean;
  userType: InheritanceEditUserDetailsUserType;
}

export const InheritanceEditUserDetailsDialogContext: Context<InheritanceEditUserDetailsDialogContextInterface> =
  createContext<InheritanceEditUserDetailsDialogContextInterface>(
    {} as InheritanceEditUserDetailsDialogContextInterface,
  );

export interface InheritanceEditUserDetailsDialogContextProviderProps
  extends InheritanceEditUserDetailsDialogProps {
  children: ReactNode;
}

export const InheritanceEditUserDetailsDialogProvider: FC<
  InheritanceEditUserDetailsDialogContextProviderProps
> = ({ children, userType }) => {
  const dispatch = useAppDispatch();

  const [isSubmittingUserDetails, setIsSubmittingUserDetails] = useState(false);
  const [userDetails, setUserDetails] = useState<IUserDetails | undefined>();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const tabs: ITabs = [
    {
      name: 'Edit Details',
      dialogs: [<EditDetails key="EditDetails" />],
    },
    { name: 'Verify OTP', dialogs: [<VerifyOTP key="VerifyOTP" />] },
    { name: 'Success', dialogs: [<Success key="Success" />] },
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
    dialogName: 'inheritanceEditUserDetails',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceEditUserDetails'));
  };

  const onUserDetailsSubmit = useCallback(async (params: IUserDetails) => {
    setIsSubmittingUserDetails(true);
    setUserDetails(params);
    await sleep(2000);
    setIsSubmittingUserDetails(false);
    goTo(1);
  }, []);

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
      userDetails,
      onUserDetailsSubmit,
      isSubmittingUserDetails,
      userType,
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
      userDetails,
      onUserDetailsSubmit,
      isSubmittingUserDetails,
      userType,
    ],
  );

  return (
    <InheritanceEditUserDetailsDialogContext.Provider value={ctx}>
      {children}
    </InheritanceEditUserDetailsDialogContext.Provider>
  );
};

export function useInheritanceEditUserDetailsDialog(): InheritanceEditUserDetailsDialogContextInterface {
  return useContext(InheritanceEditUserDetailsDialogContext);
}
