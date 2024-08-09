import React from 'react';
import { InheritancePageLayout } from '~/components';
import { MainAppLayout } from '../Layout';
import { selectLanguage, useAppSelector } from '~/store';

export const Inheritance = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <MainAppLayout topbar={{ title: lang.strings.inheritance.title }}>
      <InheritancePageLayout headingOnly lang={lang.strings.inheritance} />
    </MainAppLayout>
  );
};
