import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from './store';
import { IAccount } from '@cypherock/db-interfaces';

export interface IAccountsState {
  isLoaded: boolean;
  accounts: IAccount[];
}

const initialState: IAccountsState = {
  isLoaded: false,
  accounts: [],
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts(state, action: PayloadAction<IAccount[]>) {
      state.isLoaded = true;
      state.accounts = action.payload;
    },
  },
});

export const { setAccounts } = accountsSlice.actions;
export const selectAccounts = (state: RootState) => state.accounts;
export const selectUnHiddenAccounts: (state: RootState) => IAccountsState =
  createSelector([selectAccounts], accountState => ({
    ...accountState,
    accounts: accountState.accounts.filter(a => !a.isHidden),
  }));

export default accountsSlice.reducer;
