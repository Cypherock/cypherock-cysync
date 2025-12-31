import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  RootState,
  updateCantonAuthTokens,
  clearCantonAuthTokens,
  setCantonUnauthorizedSyncError,
  ICantonAuthTokens,
} from '~/store';
import { keyValueStore } from '~/utils/keyValueStore';

export const setCantonAccountAuthTokens = createAsyncThunk<
  void,
  ICantonAuthTokens,
  { state: RootState }
>('canton/setCantonAccountAuthTokens', async (authTokens, { dispatch }) => {
  await keyValueStore.cantonAuthTokens.set(authTokens);
  dispatch(updateCantonAuthTokens({ cantonAuthTokens: authTokens }));
  dispatch(setCantonUnauthorizedSyncError({ hasError: false }));
});

export const clearCantonAccountAuthTokens = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('canton/clearCantonAccountAuthTokens', async (_, { dispatch }) => {
  await keyValueStore.cantonAuthTokens.remove();
  dispatch(clearCantonAuthTokens());
});
