import { createSlice } from '@reduxjs/toolkit';

import { IDiscreetModeState } from './types';

import { RootState } from '../store';

export * from './types';

const initialState: IDiscreetModeState = {
  active: false,
};

export const discreetModeSlice = createSlice({
  name: 'discreetMode',
  initialState,
  reducers: {
    toggleDiscreetMode: state => {
      state.active = !state.active;
    },
  },
});

export const { toggleDiscreetMode } = discreetModeSlice.actions;

export const selectDiscreetMode = (state: RootState) => state.discreetMode;

export default discreetModeSlice.reducer;
