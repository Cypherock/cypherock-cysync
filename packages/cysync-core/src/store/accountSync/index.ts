// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  AccountSyncState,
  AccountSyncStateMap,
  IAccountSyncState,
} from './types';

import { RootState } from '../store';

export * from './types';

const initialState: IAccountSyncState = {
  syncState: AccountSyncStateMap.synced,
  accountSyncMap: {},
} as IAccountSyncState;

export const accountSyncSlice = createSlice({
  name: 'accountSync',
  initialState,
  reducers: {
    setAccountLastSyncedAt: (state, payload: PayloadAction<number>) => {
      state.lastSyncedAt = payload.payload;
    },
    setAccountSyncState: (state, payload: PayloadAction<AccountSyncState>) => {
      state.syncState = payload.payload;
    },
    setSyncError: (state, payload: PayloadAction<string>) => {
      state.syncError = payload.payload;
    },
    updateAccountSyncMap: (
      state,
      payload: PayloadAction<{
        accountId: string;
        syncState: AccountSyncState;
      }>,
    ) => {
      if (!state.accountSyncMap[payload.payload.accountId]) {
        state.accountSyncMap[payload.payload.accountId] = {};
      }

      if (payload.payload.syncState === AccountSyncStateMap.synced) {
        (state.accountSyncMap[payload.payload.accountId] as any).lastSyncedAt =
          Date.now();
      }

      (state.accountSyncMap[payload.payload.accountId] as any).syncState =
        payload.payload.syncState;
    },
  },
});

export const {
  setAccountSyncState,
  setSyncError,
  updateAccountSyncMap,
  setAccountLastSyncedAt,
} = accountSyncSlice.actions;

export const selectAccountSync = (state: RootState) => state.accountSync;

export default accountSyncSlice.reducer;
