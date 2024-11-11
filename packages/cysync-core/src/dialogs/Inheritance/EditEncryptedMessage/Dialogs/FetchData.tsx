import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditEncryptedMessageDialog } from '../context';

export const FetchData = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.inheritanceEditEncryptedMessage.syncing;

  const { onNext, fetchData } = useInheritanceEditEncryptedMessageDialog();

  useEffect(() => {
    fetchData();
    setTimeout(() => onNext(), 2000);
  }, []);

  return <LoaderDialog title={strings.title} subtext={strings.subTitle} />;
};
