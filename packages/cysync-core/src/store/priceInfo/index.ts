import { IPriceInfo } from '@cypherock/db-interfaces';
import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';

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

export const selectPriceInfos = (state: RootState) =>
  state.priceInfo.priceInfos;
export const selectPriceInfoState = (state: RootState) => state.priceInfo;

export const selectCurrentCurrencyPriceInfos: (
  state: RootState,
  currency: string,
) => IPriceInfo[] = createSelector(
  [selectPriceInfos, (state, currency: string) => currency],
  (priceInfos, currency): IPriceInfo[] => {
    const currentCurrencyPriceInfos = priceInfos.filter(
      p => p.currency === currency,
    );
    return currentCurrencyPriceInfos;
  },
);

export default priceInfoSlice.reducer;
