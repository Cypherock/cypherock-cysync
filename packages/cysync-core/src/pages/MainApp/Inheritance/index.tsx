import React from 'react';

import { MainAppLayout } from '../Layout';
import { selectLanguage, useAppSelector } from '~/store';

import { Homepage } from './Homepage';
import { SetupPage } from './SetupPage';
import { ChoosePlan } from './ChoosePlan';
import { PlanDetails } from './PlanDetails';

const renderMap = {
  setup: <SetupPage />,
  home: <Homepage />,
  choosePlan: <ChoosePlan />,
  planDetails: <PlanDetails />,
};

export const Inheritance = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <MainAppLayout topbar={{ title: lang.strings.inheritance.title }}>
      {renderMap['planDetails']}
    </MainAppLayout>
  );
};
