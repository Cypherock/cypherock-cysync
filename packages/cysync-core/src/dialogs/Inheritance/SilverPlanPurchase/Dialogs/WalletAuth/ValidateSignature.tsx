import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { WalletAuthLoginStep } from '~/dialogs/Inheritance/hooks';

import { useInheritanceSilverPlanPurchaseDialog } from '../../context';

export const ValidateSignature = () => {
  const { onNext, walletAuthStep, walletAuthValidateSignature, retryIndex } =
    useInheritanceSilverPlanPurchaseDialog();

  useEffect(() => {
    walletAuthValidateSignature();
  }, [retryIndex]);

  useEffect(() => {
    if (walletAuthStep > WalletAuthLoginStep.validateSignature) {
      onNext();
    }
  }, [walletAuthStep]);

  return <LoaderDialog />;
};
