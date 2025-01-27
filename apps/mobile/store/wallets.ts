import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from './store';
import { IWallet } from '@cypherock/db-interfaces';

export interface WalletsState {
  wallets: IWallet[];
}

const initialState: WalletsState = {
  wallets: [],
};

const walletsSlice = createSlice({
  name: 'wallets',
  initialState,
  reducers: {
    updateWallets(state, action: PayloadAction<IWallet[]>) {
      state.wallets = action.payload;
    },
  },
});

export const { updateWallets } = walletsSlice.actions;
export const selectWallets = (state: RootState) => state.wallets;
export default walletsSlice.reducer;
