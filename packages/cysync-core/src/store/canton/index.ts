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
  hasUnauthorizedSyncError: boolean;
  isSyncPrompted: boolean;
}

const initialState: ICantonState = {
  isLoaded: false,
  cantonAuthTokens: {},
  hasUnauthorizedSyncError: false,
  isSyncPrompted: false,
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
    setCantonUnauthorizedSyncError: (
      state,
      action: PayloadAction<{ hasError: boolean }>,
    ) => {
      state.hasUnauthorizedSyncError = action.payload.hasError;
      return state;
    },
    setIsSyncPrompted: (
      state,
      action: PayloadAction<{ isPrompted: boolean }>,
    ) => {
      state.isSyncPrompted = action.payload.isPrompted;
      return state;
    },
  },
});

export const {
  updateCantonAuthTokens,
  clearCantonAuthTokens,
  setCantonUnauthorizedSyncError,
  setIsSyncPrompted,
} = cantonSlice.actions;

export const selectCantonAuthTokens = (state: RootState) =>
  state.canton.cantonAuthTokens;

export const selectCantonUnauthorizedSyncError = (state: RootState) =>
  state.canton.hasUnauthorizedSyncError;

export const selectIsSyncPrompted = (state: RootState) =>
  state.canton.isSyncPrompted;

export default cantonSlice.reducer;
