import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { ChoosePlan } from './ChoosePlan';
import { Homepage } from './Homepage';
import { SetupPage } from './SetupPage';

import { MainAppLayout } from '../Layout';

const renderMap = {
  setup: <SetupPage />,
  home: <Homepage />,
  choosePlan: <ChoosePlan />,
};

export const Inheritance = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <MainAppLayout topbar={{ title: lang.strings.inheritance.title }}>
      {renderMap.choosePlan}
    </MainAppLayout>
  );
};
