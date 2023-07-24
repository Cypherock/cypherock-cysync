import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { MainAppLayout } from './Components';

export const Help: FC = () => {
  const { strings } = useAppSelector(selectLanguage);

  return <MainAppLayout title={strings.sidebar.help} />;
};
