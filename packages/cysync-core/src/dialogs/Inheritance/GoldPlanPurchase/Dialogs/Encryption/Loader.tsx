import React, { useEffect } from 'react';
import { LoaderDialog } from '~/components';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';

export const EncryptionLoader: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, setupPlan, isSetupPlanCompleted, retryIndex } =
    useInheritanceGoldPlanPurchaseDialog();

  const strings = lang.strings.inheritanceGoldPlanPurchase.encryption.loading;

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
