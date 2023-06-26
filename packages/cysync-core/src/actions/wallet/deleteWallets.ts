import { IWallet } from '@cypherock/db-interfaces';
import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import lodash from 'lodash';

import type { IWalletState, RootState } from '~/store';
import { getDB } from '~/utils';

export const deleteWallets = createAsyncThunk<
  IWallet[],
  IWallet[],
  { state: RootState }
>('wallets/deleteWallets', async (wallets: IWallet[], { getState }) => {
  const db = getDB();

  const { deletedWallets } = getState().wallet;

  for (const deletedWallet of wallets) {
    if (deletedWallet.__id === undefined) {
      continue;
    }

    await db.wallet.remove({ __id: deletedWallet.__id });
  }

  return lodash.differenceWith(
    deletedWallets,
    wallets,
    (a, b) => a.__id === b.__id,
  );
});

export const addDeleteWalletsReducer = (
  builder: ActionReducerMapBuilder<IWalletState>,
) => {
  builder
    .addCase(deleteWallets.pending, state => {
      state.deleteWalletStatus = 'loading';
    })
    .addCase(deleteWallets.fulfilled, (state, action) => {
      state.deletedWallets = action.payload;
      state.deleteWalletStatus = 'succeeded';
    })
    .addCase(deleteWallets.rejected, state => {
      state.deleteWalletStatus = 'failed';
    });
};
