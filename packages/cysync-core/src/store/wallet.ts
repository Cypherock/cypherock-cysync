// Issue with reduxjs/toolkit: https://github.com/reduxjs/redux-toolkit/issues/1806
// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';
import { createSlice } from '@reduxjs/toolkit';
import { IWallet } from '@cypherock/db-interfaces';
import type { RootState } from './store';

export interface IWalletState {
  wallets: IWallet[];
}

const initialState: IWalletState = {
  wallets: [],
} as IWalletState;

export const walletSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    addRandomWallet: state => {
      state.wallets.push({
        deviceId: 'aksd',
        name: 'test',
        hasPassphrase: false,
        hasPin: false,
      });
    },
  },
});

export const { addRandomWallet } = walletSlice.actions;

export const selectWallets = (state: RootState) => state.wallet.wallets;

export default walletSlice.reducer;
