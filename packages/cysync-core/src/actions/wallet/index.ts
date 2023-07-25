import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import type { IWalletState } from '~/store';

import { addDeleteWalletsReducer } from './deleteWallets';
import { addFetchWalletsReducer } from './fetchWallets';

export * from './deleteWallets';
export * from './syncWallets';
export * from './fetchWallets';

export const addExtraWalletReducers = (
  builder: ActionReducerMapBuilder<IWalletState>,
) => {
  addDeleteWalletsReducer(builder);
  addFetchWalletsReducer(builder);
};
