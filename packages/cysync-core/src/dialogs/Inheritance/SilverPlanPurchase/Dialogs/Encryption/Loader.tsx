import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../../context';

export const EncryptionLoader: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, setupPlan, isSetupPlanCompleted, retryIndex } =
    useInheritanceSilverPlanPurchaseDialog();

  const strings = lang.strings.inheritanceSilverPlanPurchase.encryption.loading;

  useEffect(() => {
    setupPlan();
  }, [retryIndex]);

  useEffect(() => {
    if (isSetupPlanCompleted) {
      onNext();
    }
  }, [isSetupPlanCompleted]);

  return <LoaderDialog title={strings.title} subtext={strings.subTitle} />;
};
