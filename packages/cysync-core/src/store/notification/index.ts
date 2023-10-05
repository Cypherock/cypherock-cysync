// Issue with reduxjs/toolkit: https://github.com/reduxjs/redux-toolkit/issues/1806
// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';
import { ITransaction } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { INotificationState } from './types';

import type { RootState } from '../store';

export * from './types';

const initialState: INotificationState = {
  hasUnreadNotifications: false,
  hasUnreadTranscations: false,
  isOpen: false,
  transactions: [],
  hasMoreTransactions: false,
} as INotificationState;

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    toggleNotification: state => {
      state.isOpen = !state.isOpen;
    },
    setTransactionNotifications: (
      state,
      payload: PayloadAction<{
        transactions: ITransaction[];
        hasMore: boolean;
      }>,
    ) => {
      state.transactions = payload.payload.transactions;
      state.hasMoreTransactions = payload.payload.hasMore;
    },
  },
});

export const { toggleNotification, setTransactionNotifications } =
  notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notification;

export default notificationSlice.reducer;
