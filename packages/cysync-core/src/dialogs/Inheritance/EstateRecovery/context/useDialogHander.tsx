import React, { useCallback, useMemo } from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  useAppDispatch,
  useAppSelector,
  selectLanguage,
  closeDialog,
} from '~/store';

import {
  WalletAuth,
  VerifyOTP,
  Terms,
  Success,
  AuthenticateClearData,
  ClearData,
  ConfirmClearData,
  DecryptMessage,
  FetchData,
  Message,
  Settings,
  ViewPin,
  FetchRequestId,
  ValidateSignature,
} from '../Dialogs';

export const tabIndicies = {
  terms: {
    tabNumber: 0,
    dialogs: {
      terms: 0,
    },
  },
  instructions: {
    tabNumber: 1,
    dialogs: {
      settings: 0,
      clearData: 1,
      confirmClearData: 2,
      authClearData: 3,
    },
  },
  wallet: {
    tabNumber: 2,
    dialogs: {
      fetchRequestId: 0,
      walletAuth: 1,
      validateSignature: 2,
      verifyOtp: 3,
      fetchData: 4,
    },
  },
  decrypt: {
    tabNumber: 3,
    dialogs: {
      decrypt: 0,
    },
  },
  viewPin: {
    tabNumber: 4,
    dialogs: {
      viewPin: 0,
    },
  },
  message: {
    tabNumber: 5,
    dialogs: {
      message: 0,
    },
  },
  success: {
    tabNumber: 6,
    dialogs: {
      success: 0,
    },
  },
};

export const useEstateRecoveryDialogHanlders = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        [tabIndicies.wallet.tabNumber]: [
          tabIndicies.wallet.dialogs.walletAuth,
          tabIndicies.wallet.dialogs.fetchData,
        ],
        [tabIndicies.decrypt.tabNumber]: [tabIndicies.decrypt.dialogs.decrypt],
        [tabIndicies.viewPin.tabNumber]: [tabIndicies.viewPin.dialogs.viewPin],
      }),
      [],
    );

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.inheritance.termsOfService.title,
        dialogs: [<Terms key="Terms of services" />],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.instructions.name,
        dialogs: [
          <Settings key="Settings" />,
          <ClearData key="Clear Data" />,
          <ConfirmClearData key="Confirm Clear Data" />,
          <AuthenticateClearData key="Autheticate Clear Data" />,
        ],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.wallet.name,
        dialogs: [
          <FetchRequestId key="Fetch request id" />,
          <WalletAuth key="Wallet authentication" />,
          <ValidateSignature key="Validate signature" />,
          <VerifyOTP key="Verify otp" />,
          <FetchData key="Syncing" />,
        ],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.decryption.name,
        dialogs: [<DecryptMessage key="Decrypt message" />],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.viewPin.name,
        dialogs: [<ViewPin key="View pin" />],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.viewMessage.name,
        dialogs: [<Message key="Decrypted message" />],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.confirmation.name,
        dialogs: [<Success key="Success message" />],
        dontShowOnMilestone: true,
      },
    ],
    [],
  );

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
    dialogName: 'inheritanceEstateRecovery',
  });

  const onClose = useCallback(() => {
    dispatch(closeDialog('inheritanceEstateRecovery'));
  }, []);

  return {
    onClose,
    onNext,
    onPrevious,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
    tabs,
  };
};
