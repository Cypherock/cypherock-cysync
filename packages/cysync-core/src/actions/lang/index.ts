import { getDefaultLang } from '@cypherock/cysync-core-constants';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { RootState, setLanguage } from '~/store';
import { keyValueStore } from '~/utils';

export const setAppLanguage = createAsyncThunk<
  void,
  string | undefined,
  { state: RootState }
>('lang/setAppLanguage', async (id, { dispatch }) => {
  const langId = (id as any) ?? getDefaultLang();
  await keyValueStore.appLanguage.set(langId);
  dispatch(setLanguage(langId));
});
