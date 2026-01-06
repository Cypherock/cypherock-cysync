import React, { useEffect } from 'react';

import { LoaderDialog as LoaderDialogComponent } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../../context';

export const LoaderDialog: React.FC = () => {
  const { onNext } = useAddAccountDialog();
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.addAccount.cantonSignup.loader;
  useEffect(() => {
    setTimeout(() => onNext(), 1000);
  }, []);
  return (
    <LoaderDialogComponent title={strings.title} subtext={strings.subtext} />
  );
};
