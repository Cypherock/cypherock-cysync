import React from 'react';
import { LoaderDialog } from '~/components';

import { selectLanguage, useAppSelector } from '~/store';

export const FetchData: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const strings = lang.strings.dialogs.inheritancePlanLogin.fetchData;

  return <LoaderDialog title={strings.title} subtext={strings.subTitle} />;
};
