import React from 'react';
import { MainAppLayout } from '../Layout';
import { selectLanguage, useAppSelector } from '~/store';
import { SetupPage } from './SetupPage';
import { Homepage } from './Homepage';
import { PlanDetails } from './PlanDetails';

const renderMap = {
  setup: <SetupPage />,
  home: <Homepage />,
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
