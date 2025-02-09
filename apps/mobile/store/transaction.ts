import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITransaction } from '@cypherock/db-interfaces';
import { RootState } from '../store';

export interface ITransactionState {
  isLoaded: boolean;
  transactions: ITransaction[];
}

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

export const selectTransactions = (state: RootState) => state.transactions;
export const selectTransactionById = (__id?: string) => (state: RootState) =>
  state.transactions.transactions.find((t: ITransaction) => t.__id === __id);

export default transactionSlice.reducer;
