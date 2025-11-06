// Issue with reduxjs/toolkit: https://github.com/reduxjs/redux-toolkit/issues/1806
// eslint-disable-next-line import/no-extraneous-dependencies
import 'immer';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export interface ICantonAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ICantonState {
  cantonAuthTokens: ICantonAuthTokens | undefined;
  isLoaded: boolean;
}

const initialState: ICantonState = {
  isLoaded: false,
  cantonAuthTokens: {},
} as ICantonState;

export const cantonSlice = createSlice({
  name: 'canton',
  initialState,
  reducers: {
    updateCantonAuthTokens: (
      state,
      action: PayloadAction<{
        cantonAuthTokens: ICantonAuthTokens;
      }>,
    ) => {
      state.cantonAuthTokens = action.payload.cantonAuthTokens;
      return state;
    },
    clearCantonAuthTokens: state => {
      state.cantonAuthTokens = undefined;
      return state;
    },
  },
});

export const { updateCantonAuthTokens, clearCantonAuthTokens } =
  cantonSlice.actions;

export const selectCantonAuthTokens = (state: RootState) =>
  state.canton.cantonAuthTokens;

export default cantonSlice.reducer;
