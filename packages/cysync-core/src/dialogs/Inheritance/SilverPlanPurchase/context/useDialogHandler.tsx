import React, { useCallback, useMemo } from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  useAppDispatch,
  useAppSelector,
  selectLanguage,
  closeDialog,
} from '~/store';

import {
  Checkout,
  Ensure,
  Instructions,
  SelectWallet,
  FetchRequestId,
  WalletAuth,
  ValidateSignature,
  UserDetails,
  VerifyOTP,
  DeviceEncryption,
  EncryptionLoader,
  EncryptionSuccess,
  Terms,
  Success,
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
      ensure: 0,
      video: 1,
    },
  },
  wallet: {
    tabNumber: 2,
    dialogs: {
      selectWallet: 0,
      fetchRequestId: 1,
      walletAuth: 2,
      validateSignature: 3,
    },
  },
  email: {
    tabNumber: 3,
    dialogs: {
      userDetails: 0,
      verifyOtp: 1,
    },
  },
  encryption: {
    tabNumber: 4,
    dialogs: {
      deviceEncryption: 0,
      encryptionLoader: 1,
      encryptionSuccess: 2,
    },
  },
  checkout: {
    tabNumber: 5,
    dialogs: {
      checkout: 0,
    },
  },
};

export const useSilverPlanDialogHanlders = () => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        [tabIndicies.wallet.tabNumber]: [tabIndicies.wallet.dialogs.walletAuth],
        [tabIndicies.encryption.tabNumber]: [
          tabIndicies.encryption.dialogs.deviceEncryption,
        ],
      }),
      [],
    );

  const tabs: ITabs = useMemo<ITabs>(
    () => [
      {
        name: lang.strings.inheritance.termsOfService.title,
        dialogs: [<Terms key="Terms" />],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.instructions.heading,
        dialogs: [<Ensure key="Ensure" />, <Instructions key="Instructions" />],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.wallet.heading,
        dialogs: [
          <SelectWallet key="Select Wallet" />,
          <FetchRequestId key="Fetch Request ID" />,
          <WalletAuth key="Wallet Auth" />,
          <ValidateSignature key="Validate Signature" />,
        ],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.email.heading,
        dialogs: [
          <UserDetails key="User Details" />,
          <VerifyOTP key="Verify OTP" />,
        ],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.encryption.heading,
        dialogs: [
          <DeviceEncryption key="Device Encryption" />,
          <EncryptionLoader key="Encryption Loader" />,
          <EncryptionSuccess key="Encryption Success" />,
        ],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.checkout.heading,
        dialogs: [<Checkout key="Checkout" />],
      },
      {
        name: '',
        dialogs: [<Success key="Success" />],
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
    dialogName: 'inheritanceSilverPlanPurchase',
  });

  const onClose = useCallback(() => {
    dispatch(closeDialog('inheritanceSilverPlanPurchase'));
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
