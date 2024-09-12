import { IWallet } from '@cypherock/db-interfaces';
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

import {
  ViewPin,
  FetchData,
  SuccessPinRecovery,
  DecryptPin,
  WalletAuth,
  VerifyOTP,
} from '../Dialogs';

export interface IUserDetails {
  name: string;
  email: string;
  alternateEmail: string;
}

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
  selectedWallet?: IWallet;
  userDetails?: IUserDetails;
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
  const selectedWallet = undefined;
  const userDetails = undefined;

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        0: [0],
      }),
      [],
    );

  const tabs: ITabs = [
    {
      name: lang.strings.dialogs.inheritancePinRecovery.sync.name,
      dialogs: [
        <WalletAuth key="wallet Auth" />,
        <VerifyOTP key="Verify Otp" />,
        <FetchData key="Fetch data" />,
      ],
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
      selectedWallet,
      userDetails,
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
      selectedWallet,
      userDetails,
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
