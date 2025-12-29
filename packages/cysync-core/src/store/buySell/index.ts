import { IBuySellOrder } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IBuySellOrderState } from './types';

import { RootState } from '../store';

export * from './types';

const initialState: IBuySellOrderState = {
  isLoaded: false,
  orders: [],
};

export const buySellOrdersSlice = createSlice({
  name: 'buySellOrders',
  initialState,
  reducers: {
    setBuySellOrders: (state, payload: PayloadAction<IBuySellOrder[]>) => {
      state.orders = payload.payload;
      state.isLoaded = true;
    },
  },
});

export const { setBuySellOrders } = buySellOrdersSlice.actions;

export const selectBuySellOrders = (state: RootState) => state.buySellOrder;

export default buySellOrdersSlice.reducer;
