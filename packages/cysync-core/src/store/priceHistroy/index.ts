import { IPriceHistory } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IPriceHistoryState } from './types';

import { RootState } from '../store';

export * from './types';

const initialState: IPriceHistoryState = {
  isLoaded: false,
  priceHistories: [],
} as IPriceHistoryState;

export const priceHistory = createSlice({
  name: 'priceHistories',
  initialState,
  reducers: {
    setPriceHistories: (state, payload: PayloadAction<IPriceHistory[]>) => {
      state.priceHistories = payload.payload;
      state.isLoaded = true;
    },
  },
});

export const { setPriceHistories } = priceHistory.actions;

export const selectPriceHistories = (state: RootState) => state.priceHistory;

export default priceHistory.reducer;
