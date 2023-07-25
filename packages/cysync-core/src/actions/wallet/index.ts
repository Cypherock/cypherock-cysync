import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import type { IWalletState } from '~/store';

import { addDeleteWalletsReducer } from './deleteWallets';
import { addSyncWalletsWithDeviceReducer } from './syncWallets';

export * from './deleteWallets';
export * from './syncWallets';

export const addExtraWalletReducers = (
  builder: ActionReducerMapBuilder<IWalletState>,
) => {
  addDeleteWalletsReducer(builder);
  addSyncWalletsWithDeviceReducer(builder);
};
