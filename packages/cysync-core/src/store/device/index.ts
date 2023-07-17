import { IDevice } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IDeviceState } from './types';

import { RootState } from '../store';

export * from './types';

const initialState: IDeviceState = {
  isLoaded: false,
  devices: [],
} as IDeviceState;

export const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setDevices: (state, payload: PayloadAction<IDevice[]>) => {
      state.devices = payload.payload;
      state.isLoaded = true;
    },
  },
});

export const { setDevices } = deviceSlice.actions;

export const selectDevices = (state: RootState) => state.device;

export default deviceSlice.reducer;
