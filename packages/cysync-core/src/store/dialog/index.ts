// Issue with reduxjs/toolkit: https://github.com/reduxjs/redux-toolkit/issues/1806
// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '~/store';

import { DialogName, IDialogState } from './types';

export * from './types';

const initialState: IDialogState = {
  walletSyncError: {
    isOpen: false,
  },
  walletActions: {
    isOpen: false,
  },
  guidedFlow: {
    isOpen: false,
  },
  addAccount: {
    isOpen: false,
  },
  sendGuide: {
    isOpen: false,
  },
  receiveDialog: {
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
      state[payload.payload.name].isOpen = true;
      (state[payload.payload.name] as any).data = payload.payload.data;
    },
    closeDialog: (state, payload: PayloadAction<DialogName>) => {
      state[payload.payload].isOpen = false;
      state[payload.payload].data = undefined;
    },
    closeAllDialogs: state => {
      Object.keys(state).forEach(key => {
        state[key as DialogName].isOpen = false;
        state[key as DialogName].data = undefined;
      });
    },
  },
});

export const { openDialog, closeDialog, closeAllDialogs } = dialogSlice.actions;

export const selectDialogs = (state: RootState) => state.dialog;

export default dialogSlice.reducer;
