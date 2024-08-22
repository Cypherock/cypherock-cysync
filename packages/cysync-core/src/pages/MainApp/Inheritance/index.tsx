import React from 'react';
import { InheritancePageLayout } from '~/components';
import { MainAppLayout } from '../Layout';
import { selectLanguage, useAppSelector } from '~/store';
import { SetupPage } from './SetupPage';
import { Homepage } from './Homepage';

const renderMap = {
  setup: <SetupPage />,
  home: <Homepage />,
};

export const Inheritance = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <MainAppLayout topbar={{ title: lang.strings.inheritance.title }}>
      <InheritancePageLayout
        actionButtonText={lang.strings.inheritance.buttons.syncFromEmail}
      >
        {renderMap['home']}
      </InheritancePageLayout>
    </MainAppLayout>
  );
};
