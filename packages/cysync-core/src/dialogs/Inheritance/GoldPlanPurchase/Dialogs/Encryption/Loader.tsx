import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';

export const EncryptionLoader: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext } = useInheritanceGoldPlanPurchaseDialog();

  const strings = lang.strings.inheritanceGoldPlanPurchase.encryption.loading;

  useEffect(() => {
    const timeout = setTimeout(() => {
      onNext();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return <LoaderDialog title={strings.title} subtext={strings.subTitle} />;
};
