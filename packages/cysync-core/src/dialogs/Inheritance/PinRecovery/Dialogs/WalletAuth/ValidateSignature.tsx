import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { WalletAuthLoginStep } from '~/dialogs/Inheritance/hooks';

import { useInheritancePinRecoveryDialog } from '../../context';

export const ValidateSignature = () => {
  const { onNext, walletAuthStep, walletAuthValidateSignature, retryIndex } =
    useInheritancePinRecoveryDialog();

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
