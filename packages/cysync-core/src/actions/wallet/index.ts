import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type { IWalletState } from '~/store';
import { addDeleteWalletsReducer } from './deleteWallets';

export * from './deleteWallets';
export * from './syncWallets';

export const addExtraWalletReducers = (
  builder: ActionReducerMapBuilder<IWalletState>,
) => {
  addDeleteWalletsReducer(builder);
};
