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
    setAccountSyncState: (state, payload: PayloadAction<AccountSyncState>) => {
      state.syncState = payload.payload;
    },
    updateAccountSyncMap: (
      state,
      payload: PayloadAction<{
        accountId: string;
        syncState: AccountSyncState;
      }>,
    ) => {
      state.accountSyncMap[payload.payload.accountId] =
        payload.payload.syncState;
    },
  },
});

export const { setAccountSyncState, updateAccountSyncMap } =
  accountSyncSlice.actions;

export const selectAccountSync = (state: RootState) => state.accountSync;

export default accountSyncSlice.reducer;
