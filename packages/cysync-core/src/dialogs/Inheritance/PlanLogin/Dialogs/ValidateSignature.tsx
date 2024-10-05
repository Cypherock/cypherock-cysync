import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { WalletAuthLoginStep } from '~/dialogs/Inheritance/hooks';

import { useInheritancePlanLoginDialog } from '../context';

export const ValidateSignature = () => {
  const { onNext, walletAuthStep, walletAuthValidateSignature, retryIndex } =
    useInheritancePlanLoginDialog();

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
