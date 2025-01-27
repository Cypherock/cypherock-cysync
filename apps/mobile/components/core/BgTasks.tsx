import { getDefaultLang, Language } from '@/constants';
import { keyValueStore } from '@/db';
import { setLanguage } from '@/store/lang';
import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export function BgTasks() {
  const dispatch = useDispatch();

  const getSavedLanguage = useCallback(
    async function () {
      try {
        const lang = await keyValueStore.appLanguage.get();
        dispatch(setLanguage((lang as Language) ?? getDefaultLang()));
      } catch {
        //TODO: Error Handling
        throw new Error("Couldn't get saved language");
      }
    },
    [dispatch],
  );

  useEffect(() => {
    getSavedLanguage();
  }, [getSavedLanguage]);

  return null;
}
