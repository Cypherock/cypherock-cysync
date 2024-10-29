import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { useCallbackAfterCountdown } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../../context';

export const EncryptionLoader: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, setupPlan, isSetupPlanCompleted, retryIndex } =
    useInheritanceSilverPlanPurchaseDialog();

  const strings = lang.strings.inheritanceSilverPlanPurchase.encryption.loading;

  const onNextCallback = useCallbackAfterCountdown(onNext, 3000);

  useEffect(() => {
    onNextCallback.setStartTime(Date.now());
    setupPlan();
  }, [retryIndex]);

  useEffect(() => {
    if (isSetupPlanCompleted) {
      onNextCallback.start();
    }

    return () => {
      onNextCallback.stop();
    };
  }, [isSetupPlanCompleted]);

  return <LoaderDialog title={strings.title} subtext={strings.subTitle} />;
};
