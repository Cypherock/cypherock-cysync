import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { ITabs, useMemoReturn, useTabsAndDialogs } from '~/hooks';
import { inheritanceLoginService } from '~/services';
import { closeDialog, useAppDispatch } from '~/store';

import {
  InheritanceEditUserDetailsUserType,
  InheritanceEditUserDetailsDialogProps,
} from '..';
import { IOtpVerificationDetails } from '../../hooks';
import { useAuthTokenConfig } from '../../hooks/useAuthConfig';
import { useCaptureUnhandledErrors } from '../../hooks/useCatpureUnhandledErrors';
import { EditDetails, Success, VerifyOTP } from '../Dialogs';
import { ConfirmVerification } from '../Dialogs/ConfirmVerification';

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
  userType: InheritanceEditUserDetailsUserType;
  isLoading: boolean;
  onRetry: () => void;
  otpVerificationDetails?: IOtpVerificationDetails;
  verifyOtp: (otp: string) => Promise<boolean>;
  isVerifyingOtp: boolean;
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
> = ({ children, userType, walletId }) => {
  const dispatch = useAppDispatch();

  const [userDetails] = useState<IUserDetails | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const tabs: ITabs = [
    {
      name: 'Edit Details',
      dialogs: [<EditDetails key="EditDetails" />],
    },
    {
      name: 'ConfirmVerification',
      dialogs: [<ConfirmVerification key="ConfirmVerification" />],
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

  const { unhandledError, setUnhandledError, captureErrors } =
    useCaptureUnhandledErrors();

  const onClose = () => {
    dispatch(closeDialog('inheritanceEditUserDetails'));
  };

  const onRetry = () => {
    setUnhandledError(undefined);
    goTo(0);
  };

  const { authTokenConfig } = useAuthTokenConfig({
    walletId,
    authType: 'SEED',
  });

  const onUserDetailsSubmit = useCallback(
    captureErrors(async (params: IUserDetails) => {
      if (userType === 'executor') {
        setIsLoading(true);
        onNext();
        await inheritanceLoginService.updateExecutor({
          name: params.name,
          email: params.email,
          alternateEmail: params.alternateEmail,
          authTokenConfig,
        });
        goTo(3);
        setIsLoading(false);
      }
    }),
    [userType],
  );

  const ctx = useMemoReturn({
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
    userType,
    onRetry,
    unhandledError,
    isVerifyingOtp: false,
    verifyOtp: async (otp: string) => !!otp,
    isLoading,
    otpVerificationDetails: undefined,
  });

  return (
    <InheritanceEditUserDetailsDialogContext.Provider value={ctx}>
      {children}
    </InheritanceEditUserDetailsDialogContext.Provider>
  );
};

export function useInheritanceEditUserDetailsDialog(): InheritanceEditUserDetailsDialogContextInterface {
  return useContext(InheritanceEditUserDetailsDialogContext);
}
