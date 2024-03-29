import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import logger from '~/utils/logger';

import { INetworkState } from './types';

import { RootState } from '../store';

export * from './types';

const initialState: INetworkState = {
  active: false,
};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkState: (state, payload: PayloadAction<boolean>) => {
      logger.info('Network State Updated', { isActive: payload.payload });
      state.active = payload.payload;
    },
  },
});

export const { setNetworkState } = networkSlice.actions;

export const selectNetwork = (state: RootState) => state.network;

export default networkSlice.reducer;
