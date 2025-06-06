// Issue with reduxjs/toolkit: https://github.com/reduxjs/redux-toolkit/issues/1806
// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '~/store';
import logger from '~/utils/logger';

import { DialogName, IDialogState } from './types';

export * from './types';

const initialState: IDialogState = {
  contactSupportDialog: {
    isOpen: false,
  },
  appUpdateDialog: {
    isOpen: false,
  },
  deviceUpdateDialog: {
    isOpen: false,
  },
  deviceAuthenticationDialog: {
    isOpen: false,
  },
  errorDialog: {
    isOpen: false,
  },
  walletActions: {
    isOpen: false,
  },
  guidedFlow: {
    isOpen: false,
  },
  walletSyncError: {
    isOpen: false,
  },
  addAccount: {
    isOpen: false,
  },
  addToken: {
    isOpen: false,
  },
  deployAccountDialog: {
    isOpen: false,
  },
  sendDialog: {
    isOpen: false,
  },
  signMessage: {
    isOpen: false,
  },
  walletConnect: {
    isOpen: false,
  },
  receive: {
    isOpen: false,
  },
  removePassword: {
    isOpen: false,
  },
  changePassword: {
    isOpen: false,
  },
  editAccount: {
    isOpen: false,
  },
  resetCySync: {
    isOpen: false,
  },
  setPassword: {
    isOpen: false,
  },
  authenticateX1Vault: {
    isOpen: false,
  },
  authenticateX1Card: {
    isOpen: false,
  },
  releaseNotes: {
    isOpen: false,
  },
  historyDialog: {
    isOpen: false,
  },
  swapDialog: {
    isOpen: false,
  },
  deleteAccount: {
    isOpen: false,
  },
  betaNotificationDialog: {
    isOpen: false,
  },
  inheritanceSyncPlans: {
    isOpen: false,
  },
  inheritancePlanLogin: {
    isOpen: false,
  },
  inheritanceSilverPlanPurchase: {
    isOpen: false,
  },
  inheritanceGoldPlanPurchase: {
    isOpen: false,
  },
  inheritanceEditExecutorMessage: {
    isOpen: false,
  },
  inheritanceEditReminderTime: {
    isOpen: false,
  },
  inheritanceEditUserDetails: {
    isOpen: false,
  },
  inheritancePinRecovery: {
    isOpen: false,
  },
  inheritanceEditEncryptedMessage: {
    isOpen: false,
  },
  inheritanceEstateRecovery: {
    isOpen: false,
  },
  mobileAppSyncDialog: {
    isOpen: false,
  },
};

export const dialogSlice = createSlice({
  name: 'dialogs',
  initialState,
  reducers: {
    openDialog: (
      state,
      payload: PayloadAction<{ name: DialogName; data: any }>,
    ) => {
      logger.info('Dialog: Open', { dialogName: payload.payload.name });
      state[payload.payload.name].isOpen = true;
      (state[payload.payload.name] as any).data = payload.payload.data;
    },
    closeDialog: (state, payload: PayloadAction<DialogName>) => {
      logger.info('Dialog: Close', { dialogName: payload.payload });
      state[payload.payload].isOpen = false;
      state[payload.payload].data = undefined;
    },
    closeAllDialogs: state => {
      logger.info('Dialog: Close All');
      Object.keys(state).forEach(key => {
        if (state[key as DialogName].isOpen)
          logger.verbose('Dialog: Close', { dialogName: key });
        state[key as DialogName].isOpen = false;
        state[key as DialogName].data = undefined;
      });
    },
  },
});

export const { openDialog, closeDialog, closeAllDialogs } = dialogSlice.actions;

export const selectDialogs = (state: RootState) => state.dialog;

export default dialogSlice.reducer;
