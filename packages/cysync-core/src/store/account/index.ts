// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';

import { IAccount } from '@cypherock/db-interfaces';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAccountState } from './types';

import { RootState } from '../store';

export * from './types';

const initialState: IAccountState = {
  isLoaded: false,
  accounts: [],
};

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

export const selectUnHiddenAccounts: (state: RootState) => IAccountState =
  createSelector([selectAccounts], accountState => ({
    ...accountState,
    accounts: accountState.accounts.filter(a => !a.isHidden),
  }));

export default accountSlice.reducer;
