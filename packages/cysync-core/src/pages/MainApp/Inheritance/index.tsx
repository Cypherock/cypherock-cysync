import React from 'react';
import { InheritancePageLayout } from '~/components';
import { MainAppLayout } from '../Layout';
import { selectLanguage, useAppSelector } from '~/store';
import { Homepage } from './Homepage';

export const Inheritance = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <MainAppLayout topbar={{ title: lang.strings.inheritance.title }}>
      <InheritancePageLayout
        lang={lang.strings.inheritance}
        actionButtonText={lang.strings.inheritance.buttons.syncPlans}
      >
        <Homepage lang={lang} />
      </InheritancePageLayout>
    </MainAppLayout>
  );
};
