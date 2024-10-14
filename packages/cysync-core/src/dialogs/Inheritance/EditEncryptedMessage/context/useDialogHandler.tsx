import React, { useMemo } from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import { useAppDispatch, closeDialog } from '~/store';

import {
  Confirmation,
  FetchData,
  Decryption,
  EditMessage,
  ConfirmMessage,
  Encryption,
  Success,
} from '../Dialogs';

export const tabIndicies = {
  confirmation: {
    tabNumber: 0,
    dialogs: {
      confirmation: 0,
    },
  },
  fetchData: {
    tabNumber: 1,
    dialogs: {
      fetchData: 0,
    },
  },
  decryption: {
    tabNumber: 2,
    dialogs: {
      decryption: 0,
    },
  },
  editMessage: {
    tabNumber: 3,
    dialogs: {
      editMessage: 0,
    },
  },
  confirmMessage: {
    tabNumber: 4,
    dialogs: {
      confirmMessage: 0,
    },
  },
  encryption: {
    tabNumber: 5,
    dialogs: {
      encryption: 0,
    },
  },
  success: {
    tabNumber: 6,
    dialogs: {
      success: 0,
    },
  },
};

export const useInheritanceEditEncryptedMessageDialogHandler = () => {
  const dispatch = useAppDispatch();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        [tabIndicies.fetchData.tabNumber]: [
          tabIndicies.fetchData.dialogs.fetchData,
        ],
        [tabIndicies.encryption.tabNumber]: [
          tabIndicies.encryption.dialogs.encryption,
        ],
      }),
      [],
    );

  const tabs: ITabs = [
    { name: 'Confirmation', dialogs: [<Confirmation key="Confirmation" />] },
    { name: 'Fetch Data', dialogs: [<FetchData key="Fetch Data" />] },
    { name: 'Decryption', dialogs: [<Decryption key="Decryption" />] },
    { name: 'Edit Message', dialogs: [<EditMessage key="Edit Message" />] },
    {
      name: 'Confirm Message',
      dialogs: [<ConfirmMessage key="Confirm Message" />],
    },
    {
      name: 'Encryption',
      dialogs: [<Encryption key="Encryption" />],
    },
    {
      name: 'Success',
      dialogs: [<Success key="Success" />],
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
    dialogName: 'inheritanceEditEncryptedMessage',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceEditEncryptedMessage'));
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
