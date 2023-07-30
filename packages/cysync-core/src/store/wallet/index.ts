// Issue with reduxjs/toolkit: https://github.com/reduxjs/redux-toolkit/issues/1806
// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';
import { IWallet } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { addExtraWalletReducers } from '~/actions';

import { IWalletState } from './types';

import type { RootState } from '../store';

export * from './types';

const initialState: IWalletState = {
  isLoaded: false,
  wallets: [],
  deletedWallets: [],
  deleteWalletStatus: 'idle',
  syncWalletStatus: 'idle',
} as IWalletState;

export const walletSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setWallets: (state, payload: PayloadAction<IWallet[]>) => {
      state.wallets = payload.payload.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      state.isLoaded = true;
    },
    setDeletedWallets: (state, payload: PayloadAction<IWallet[]>) => {
      state.deletedWallets = payload.payload.sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      state.deleteWalletStatus = 'idle';
    },
  },
  extraReducers(builder) {
    addExtraWalletReducers(builder);
  },
});

export const { setWallets, setDeletedWallets } = walletSlice.actions;

export const selectWallets = (state: RootState) => state.wallet;

export default walletSlice.reducer;
