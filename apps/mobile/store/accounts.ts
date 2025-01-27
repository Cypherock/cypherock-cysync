import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from './store';
import { IAccount } from '@cypherock/db-interfaces';

export interface AccountsState {
  accounts: IAccount[];
}

const initialState: AccountsState = {
  accounts: [],
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    updateAccounts(state, action: PayloadAction<IAccount[]>) {
      state.accounts = action.payload;
    },
  },
});

export const { updateAccounts } = accountsSlice.actions;
export const selectAccounts = (state: RootState) => state.accounts;
export default accountsSlice.reducer;
