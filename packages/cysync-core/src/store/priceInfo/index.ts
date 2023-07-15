import { IPriceInfo } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IPriceInfoState } from './types';

import { RootState } from '../store';

export * from './types';

const initialState: IPriceInfoState = {
  isLoaded: false,
  priceInfos: [],
} as IPriceInfoState;

export const priceInfoSlice = createSlice({
  name: 'priceInfos',
  initialState,
  reducers: {
    setPriceInfos: (state, payload: PayloadAction<IPriceInfo[]>) => {
      state.priceInfos = payload.payload;
      state.isLoaded = true;
    },
  },
});

export const { setPriceInfos } = priceInfoSlice.actions;

export const selectPriceInfos = (state: RootState) => state.priceInfo;

export default priceInfoSlice.reducer;
