import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { WalletAuthLoginStep } from '~/dialogs/Inheritance/hooks';

import { useInheritanceEstateRecoveryDialog } from '../../context';

export const ValidateSignature = () => {
  const { onNext, walletAuthStep, walletAuthValidateSignature, retryIndex } =
    useInheritanceEstateRecoveryDialog();

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
