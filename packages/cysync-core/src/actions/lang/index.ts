import { getDefaultLang } from '@cypherock/cysync-core-constants';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { ANALYTICS_EVENTS } from '~/services/analytics/analyticsEvents';
import { analyticsService } from '~/services/analytics/analyticsService';
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
  analyticsService.trackEvent(ANALYTICS_EVENTS.PREFERENCE_LANGUAGE_SELECTED, {
    language: langId,
    source: 'update',
  });
});
