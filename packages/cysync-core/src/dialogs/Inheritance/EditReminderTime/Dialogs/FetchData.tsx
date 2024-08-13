import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditReminderTimeDialog } from '../context';

export const FetchData = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.inheritanceEditReminderTime.fetchData;
  const { fetchData } = useInheritanceEditReminderTimeDialog();

  useEffect(() => {
    fetchData();
  }, []);

  return <LoaderDialog title={strings.title} subtext={strings.subTitle} />;
};
