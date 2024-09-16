import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';
import { useInheritanceEditExecutorMessageDialog } from '../context';

export const FetchData = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.inheritanceEditExecutorMessage.fetchData;
  const { fetchData } = useInheritanceEditExecutorMessageDialog();

  useEffect(() => fetchData(), []);

  return <LoaderDialog title={strings.title} subtext={strings.subTitle} />;
};
