import { LoaderDialog as LoaderDialogComponent } from '~/components';
import React, { useEffect } from 'react';
import { useAddAccountDialog } from '../../context';
import { selectLanguage, useAppSelector } from '~/store';

export const LoaderDialog: React.FC = () => {
  const { onNext } = useAddAccountDialog();
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.addAccount.cantonSignup.loader;
  useEffect(() => {
    setTimeout(() => onNext(), 3000);
  }, []);
  return (
    <LoaderDialogComponent title={strings.title} subtext={strings.subtext} />
  );
};
