import { ITransaction } from '@cypherock/db-interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ITransactionState } from './types';

import { RootState } from '../store';

export * from './types';

const initialState: ITransactionState = {
  isLoaded: false,
  transactions: [],
} as ITransactionState;

export const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setTransactions: (state, payload: PayloadAction<ITransaction[]>) => {
      state.transactions = payload.payload;
      state.isLoaded = true;
    },
  },
});

export const { setTransactions } = transactionSlice.actions;

export const selectTransactions = (state: RootState) => state.transaction;

export default transactionSlice.reducer;
