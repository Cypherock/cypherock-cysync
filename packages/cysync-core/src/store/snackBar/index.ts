import { SnackBarProps } from '@cypherock/cysync-ui';
import { sleep } from '@cypherock/cysync-utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '~/store';

import { ISnackBarState } from './types';

export * from './types';

const initialState: ISnackBarState = {
  isOpen: false,
  props: undefined,
  snackBarId: undefined,
};

export const openSnackBar = createAsyncThunk<
  any,
  SnackBarProps & { timeout?: number }
>('snackBar/openSnackBar', async args => {
  await sleep(args.timeout ?? 5000);
});

export const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    closeSnackBar: state => {
      state.isOpen = false;
      state.snackBarId = undefined;
      state.props = undefined;
    },
  },
  extraReducers: builder => {
    builder.addCase(openSnackBar.pending, (state, action) => {
      state.isOpen = true;
      state.snackBarId = action.meta.requestId;
      state.props = action.meta.arg;
    });
    builder.addCase(openSnackBar.fulfilled, (state, action) => {
      if (state.snackBarId !== action.meta.requestId) return;
      state.isOpen = false;
      state.snackBarId = undefined;
      state.props = undefined;
    });
  },
});

export const { closeSnackBar } = snackBarSlice.actions;

export const selectSnackBar = (state: RootState) => state.snackBar;

export default snackBarSlice.reducer;
