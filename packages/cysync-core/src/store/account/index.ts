// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';

import { IAccount } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAccountState } from './types';

import { RootState } from '../store';

export * from './types';

const initialState: IAccountState = {
  isLoaded: false,
  accounts: [],
} as IAccountState;

export const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, payload: PayloadAction<IAccount[]>) => {
      state.accounts = payload.payload;
      state.isLoaded = true;
    },
  },
});

export const { setAccounts } = accountSlice.actions;

export const selectAccounts = (state: RootState) => state.account;

export default accountSlice.reducer;
