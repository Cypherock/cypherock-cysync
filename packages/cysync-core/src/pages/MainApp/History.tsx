import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { MainAppLayout } from './Components';

export const History: FC = () => {
  const { strings } = useAppSelector(selectLanguage);

  return <MainAppLayout title={strings.sidebar.history} />;
};
