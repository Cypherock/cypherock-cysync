// Issue with reduxjs/toolkit: https://github.com/reduxjs/redux-toolkit/issues/1806
// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from './store';

export interface IWalletAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IInheritanceState {
  walletAuthTokens: Record<string, IWalletAuthTokens | undefined>;
}

const initialState: IInheritanceState = {
  walletAuthTokens: {},
} as IInheritanceState;

export const inheritanceSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    updateWalletAuthTokens: (
      state,
      action: PayloadAction<{
        walletId: string;
        authTokens: IWalletAuthTokens;
      }>,
    ) => {
      state.walletAuthTokens[action.payload.walletId] =
        action.payload.authTokens;
      return state;
    },
  },
});

export const { updateWalletAuthTokens } = inheritanceSlice.actions;

export const selectInheritance = (state: RootState) => state.inheritance;

export default inheritanceSlice.reducer;
