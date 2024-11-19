import React, { useMemo } from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  useAppDispatch,
  useAppSelector,
  selectLanguage,
  closeDialog,
} from '~/store';

import {
  DeviceEncryption,
  EncryptionLoader,
  EncryptionSuccess,
  Ensure,
  Instructions,
  SelectWallet,
  Terms,
  UserDetails,
  VerifyOTP,
  WalletAuth,
  Nominee,
  NomineeDetails,
  VerifyNomineeOtp,
  ConfirmNomineeVerification,
  ExecutorDetails,
  SelectExecutor,
  ExecutorMessageTutorial,
  ExecutorMessage,
  ExecutorReminderSetup,
  Checkout,
  NomineePrivateMessageInput,
  Greeting,
  Summary,
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
  owner: {
    tabNumber: 3,
    dialogs: {
      userDetails: 0,
      verifyOtp: 1,
    },
  },
  nominieeAndExecutor: {
    tabNumber: 4,
    dialogs: {
      nomineeCountSelect: 0,
      firstNomineeDetails: 1,
      firstNomineeConfirmOtp: 2,
      firstNomineeVerifyOtp: 3,
      secondNomineeDetails: 4,
      secondNomineeConfirmOtp: 5,
      secondNomineeVerifyOtp: 6,
      executorSelect: 7,
      executorDetails: 8,
    },
  },
  message: {
    tabNumber: 5,
    dialogs: {
      video: 0,
      personalMessageInput: 1,
      executorMessageInput: 2,
    },
  },
  reminder: {
    tabNumber: 6,
    dialogs: {
      reminderInput: 0,
    },
  },
  summary: {
    tabNumber: 7,
    dialogs: {
      summary: 0,
    },
  },
  encryption: {
    tabNumber: 8,
    dialogs: {
      deviceEncryption: 0,
      encryptionLoader: 1,
      encryptionSuccess: 2,
    },
  },
  checkout: {
    tabNumber: 9,
    dialogs: {
      checkout: 0,
    },
  },
};
export const useGoldPlanDialogHanlders = () => {
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

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.inheritance.termsOfService.title,
        dialogs: [<Terms key="Terms" />],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.instructions.heading,
        dialogs: [<Ensure key="Ensure" />, <Instructions key="Instructions" />],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.wallet.heading,
        dialogs: [
          <SelectWallet key="Select Wallet" />,
          <FetchRequestId key="Fetch Request ID" />,
          <WalletAuth key="Wallet Auth" />,
          <ValidateSignature key="Validate Signature" />,
        ],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.email.heading,
        dialogs: [
          <UserDetails key="User Details" />,
          <VerifyOTP key="Verify OTP" />,
        ],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor
          .heading,
        dialogs: [
          <Nominee key="Nominee" />,
          <NomineeDetails key="Nominee Details First" index={0} />,
          <ConfirmNomineeVerification
            key="Confirm Nominee Verification First"
            index={0}
          />,
          <VerifyNomineeOtp key="Verify Nominee Otp First" index={0} />,
          <NomineeDetails key="Nominee Details Second" index={1} />,
          <ConfirmNomineeVerification
            key="Confirm Nominee Verification Second"
            index={1}
          />,
          <VerifyNomineeOtp key="Verify Nominee Otp Second" index={1} />,
          <SelectExecutor key="Confirm Executor" />,
          <ExecutorDetails key="Executor Details" />,
        ],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.message.heading,
        dialogs: [
          <ExecutorMessageTutorial key="Message Tutorial" />,
          <NomineePrivateMessageInput key="Executor Private Message" />,
          <ExecutorMessage key="Executor Message" />,
        ],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.reminder.heading,
        dialogs: [<ExecutorReminderSetup key="Reminder Setup" />],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.summary.heading,
        dialogs: [<Summary key="Summary" />],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.encryption.heading,
        dialogs: [
          <DeviceEncryption key="Device Encryption" />,
          <EncryptionLoader key="Encryption Loader" />,
          <EncryptionSuccess key="Encryption Success" />,
        ],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.checkout.heading,
        dialogs: [<Checkout key="Checkout" />],
      },
      {
        name: '',
        dialogs: [<Greeting key="Greeting" />],
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
    dialogName: 'inheritanceGoldPlanPurchase',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceGoldPlanPurchase'));
  };

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
