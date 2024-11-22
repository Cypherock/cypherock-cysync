import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritancePinRecoveryDialog } from '../../context';

export const FetchData = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.inheritancePinRecovery.sync.fetch;
  const { onNext, retryIndex, fetchEncryptedData, isEncryptedDataFetched } =
    useInheritancePinRecoveryDialog();

  useEffect(() => {
    fetchEncryptedData();
  }, [retryIndex]);

  useEffect(() => {
    if (isEncryptedDataFetched) {
      onNext();
    }
  }, [isEncryptedDataFetched]);

  return <LoaderDialog title={strings.title} subtext={strings.subTitle} />;
};
