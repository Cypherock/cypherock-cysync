// Issue with reduxjs/toolkit: https://github.com/reduxjs/redux-toolkit/issues/1806
// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';
import { ITransaction } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import logger from '~/utils/logger';

import { INotificationState } from './types';

import type { RootState } from '../store';

export * from './types';

const initialState: INotificationState = {
  hasUnreadTransactions: false,
  unreadTransactions: 0,
  isOpen: false,
  transactions: [],
} as INotificationState;

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    toggleNotification: state => {
      state.isOpen = !state.isOpen;
      logger.info('Toggle Notification', { isOpen: state.isOpen });
    },
    setTransactionNotifications: (
      state,
      payload: PayloadAction<{
        transactions: ITransaction[];
        unRead: number;
      }>,
    ) => {
      state.transactions = payload.payload.transactions;
      state.unreadTransactions = payload.payload.unRead;
      state.hasUnreadTransactions = payload.payload.unRead > 0;
    },
  },
});

export const { toggleNotification, setTransactionNotifications } =
  notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notification;

export default notificationSlice.reducer;
