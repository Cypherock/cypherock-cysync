// Issue with reduxjs/toolkit: https://github.com/reduxjs/redux-toolkit/issues/1806
// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from './store';

export interface ILastConnectedFirmwareState {
  isFirmwareBtcOnly: boolean;
}

const initialState: ILastConnectedFirmwareState = {
  isFirmwareBtcOnly: false,
} as ILastConnectedFirmwareState;

export const lastConnectedFirmwareSlice = createSlice({
  name: 'lastConnectedFirmware',
  initialState,
  reducers: {
    setIsFirmwareBtcOnly: (state, action: PayloadAction<boolean>) => {
      state.isFirmwareBtcOnly = action.payload;
    },
  },
});

export const { setIsFirmwareBtcOnly } = lastConnectedFirmwareSlice.actions;

export const selectLastConnectedFirmware = (state: RootState) =>
  state.lastConnectedFirmware;

export default lastConnectedFirmwareSlice.reducer;
