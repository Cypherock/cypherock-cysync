import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '~/store';

import { ISnackBarState } from './types';
import { SnackBarProps } from '@cypherock/cysync-ui';

export * from './types';

const initialState: ISnackBarState = {
  isOpen: false,
  text: '',
  imageSrc: '',
  imageAlt: '',
  buttonName: '',
  timeoutId: undefined,
};

export const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    openSnackBar: (state, payload: PayloadAction<SnackBarProps>) => {
      // If snackBar is already open, close it first
      if (state.isOpen) {
        state.isOpen = false;
        clearTimeout(state.timeoutId);
      }

      state.isOpen = true;
      state.text = payload.payload.text;
      state.imageSrc = payload.payload.imageSrc;
      state.imageAlt = payload.payload.imageAlt;
      state.buttonName = payload.payload.buttonName;

      // Add autoHideDuration property to close snackBar after 5 seconds
      const timeoutId = setTimeout(() => {
        state.isOpen = false;
        state.timeoutId = undefined;
      }, 5000);

      // Track reference to setTimeout
      state.timeoutId = timeoutId;
    },
    closeSnackBar: state => {
      state.isOpen = false;
      clearTimeout(state.timeoutId);
    },
  },
});

export const { openSnackBar, closeSnackBar } = snackBarSlice.actions;

export const selectSnackBar = (state: RootState) => state.snackBar;

export default snackBarSlice.reducer;
