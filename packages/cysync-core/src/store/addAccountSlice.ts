// import 'immer';
import { createSlice } from '@reduxjs/toolkit';

import type { RootState } from './store';

import addAccount, { AddAccountStrings } from '../constants/i18n/addAccount'; // Adjust this import path according to your file structure

export interface IAddAccountState {
  strings: AddAccountStrings;
}

// Assuming you have a function similar to getLangStrings to fetch the AddAccountStrings
const initialState: IAddAccountState = {
  strings: addAccount,
} as IAddAccountState;

export const addAccountSlice = createSlice({
  name: 'addAccount',
  initialState,
  reducers: {
    // setAddAccountStrings: (_, action: PayloadAction<AddAccountStrings>) => ({ strings: action.payload }),
  },
});

// export const { setAddAccountStrings } = addAccountSlice.actions;

export const selectAddAccountStrings = (state: RootState) =>
  state.addAccount.strings;

export default addAccountSlice.reducer;
