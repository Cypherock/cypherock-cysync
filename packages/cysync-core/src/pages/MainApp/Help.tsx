import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { MainAppLayout } from './Layout';

export const Help: FC = () => {
  const { strings } = useAppSelector(selectLanguage);

  return <MainAppLayout topbar={{ title: strings.sidebar.help }} />;
};
