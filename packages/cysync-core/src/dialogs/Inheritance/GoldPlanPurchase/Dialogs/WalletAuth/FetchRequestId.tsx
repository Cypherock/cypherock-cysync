import React, { useEffect } from 'react';

import { LoaderDialog } from '~/components';
import { WalletAuthLoginStep } from '~/dialogs/Inheritance/hooks';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';

export const FetchRequestId = () => {
  const { onNext, walletAuthStep, walletAuthFetchRequestId, retryIndex } =
    useInheritanceGoldPlanPurchaseDialog();

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
