import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';

export const FetchData = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.inheritanceEstateRecovery.syncing;
  const { onNext } = useInheritanceEstateRecoveryDialog();

  useEffect(() => {
    setTimeout(() => {
      onNext();
    }, 2000);
  });

  return <LoaderDialog title={strings.title} subtext={strings.subTitle} />;
};
