import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { WalletAuthLoginStep } from '~/dialogs/Inheritance/hooks';

import { useInheritancePinRecoveryDialog } from '../../context';

export const FetchRequestId = () => {
  const { onNext, walletAuthStep, walletAuthFetchRequestId, retryIndex } =
    useInheritancePinRecoveryDialog();

  useEffect(() => {
    walletAuthFetchRequestId();
  }, [retryIndex]);

  useEffect(() => {
    if (walletAuthStep > WalletAuthLoginStep.fetchRequestId) {
      onNext();
    }
  }, [walletAuthStep]);

  return <LoaderDialog />;
};
