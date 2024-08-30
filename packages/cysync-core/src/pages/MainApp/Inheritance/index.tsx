import React from 'react';

import { InheritancePageLayout } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { MainAppLayout } from '../Layout';

export const Inheritance = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <MainAppLayout topbar={{ title: lang.strings.inheritance.title }}>
      <InheritancePageLayout
        headingOnly
        lang={lang.strings.inheritance}
        actionButtonText={lang.strings.inheritance.buttons.syncPlans}
      />
    </MainAppLayout>
  );
};
