import React, { useEffect } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../../context';
import { LoaderDialog } from '~/components';

export const EncryptionLoader: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext } = useInheritanceSilverPlanPurchaseDialog();

  const strings = lang.strings.inheritanceSilverPlanPurchase.encryption.loading;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onNext();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return <LoaderDialog title={strings.title} subtext={strings.subTitle} />;
};
