import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState, setIsFirmwareBtcOnly } from '~/store';
import { keyValueStore } from '~/utils';

export const setIsLastConnectedFirmwareBtcOnly = createAsyncThunk<
  void,
  boolean,
  { state: RootState }
>('lastConnectedFirmware/setIsFirmwareBtcOnly', async (val, { dispatch }) => {
  await keyValueStore.isLastConnectedFirmwareBtcOnly.set(val ?? false);
  dispatch(setIsFirmwareBtcOnly(val ?? false));
});
