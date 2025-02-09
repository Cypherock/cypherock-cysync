import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from './store';
import { IWallet } from '@cypherock/db-interfaces';

export interface IWalletsState {
  wallets: IWallet[];
}

const initialState: IWalletsState = {
  wallets: [],
};

const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    setWallets(state, action: PayloadAction<IWallet[]>) {
      state.wallets = action.payload;
    },
  },
});

export const { setWallets } = walletsSlice.actions;
export const selectWallets = (state: RootState) => state.wallets;
export default walletsSlice.reducer;
