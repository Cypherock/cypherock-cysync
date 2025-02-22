import 'immer';
import { ITransaction } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface INotificationState {
  unreadTransactions: number;
  transactions: (ITransaction & { isClicked?: boolean })[];
  isOpen: boolean;
}

import type { RootState } from '.';

const initialState: INotificationState = {
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
      console.info('Toggle Notification', { isOpen: state.isOpen });
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
    },
  },
});

export const { toggleNotification, setTransactionNotifications } =
  notificationSlice.actions;

export const selectNotifications = (state: RootState) => state.notification;

export default notificationSlice.reducer;
