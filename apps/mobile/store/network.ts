import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';

export interface INetworkState {
  active: boolean;
}

const initialState: INetworkState = {
  active: false,
};

export const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setNetworkState: (state, payload: PayloadAction<boolean>) => {
      console.info('Network State Updated', { isActive: payload.payload });
      state.active = payload.payload;
    },
  },
});

export const { setNetworkState } = networkSlice.actions;

export const selectNetwork = (state: RootState) => state.network;

export default networkSlice.reducer;
