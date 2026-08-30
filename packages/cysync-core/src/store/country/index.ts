import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';

export interface ICountryState {
  countryCode: string | undefined;
}

const initialState: ICountryState = {
  countryCode: undefined,
};

export const countrySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {
    setCountryCode: (state, action: PayloadAction<string | undefined>) => {
      state.countryCode = action.payload;
    },
  },
});

export const { setCountryCode } = countrySlice.actions;

export const selectCountry = (state: RootState) => state.country;

export default countrySlice.reducer;
