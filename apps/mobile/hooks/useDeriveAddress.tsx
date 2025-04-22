import { useState, useRef, useCallback, useEffect } from 'react';
import { Observer, Subscription } from 'rxjs';
const { getCoinSupport } = require('@cypherock/coin-support');
import { IReceiveEvent } from '@cypherock/coin-support-interfaces';
import { getDB } from '@/utils';
import { IAccount } from '@cypherock/db-interfaces';

interface UseDeriveAddressProps {
  selectedAccount?: IAccount;
}

export const useDeriveAddress = ({
  selectedAccount,
}: UseDeriveAddressProps) => {
  const [derivedAddress, setDerivedAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const flowSubscription = useRef<Subscription | undefined>();

  const onError = (err: any) => {
    throw err;
  };

  const cleanUp = () => {
    if (flowSubscription.current) {
      flowSubscription.current.unsubscribe();
      flowSubscription.current = undefined;
    }
  };

  const getFlowObserver = (): Observer<IReceiveEvent> => ({
    next: payload => {
      if (payload.address) {
        setDerivedAddress(payload.address);
        setIsLoading(false);
      }
    },
    error: err => {
      onError(err);
      cleanUp();
    },
    complete: () => {
      cleanUp();
    },
  });

  const getWalletAddress = useCallback(async () => {
    try {
      if (!selectedAccount) return;
      setIsLoading(true);
      const coinSupport = getCoinSupport(selectedAccount.familyId);
      const subscription = coinSupport
        .receive({
          accountId: selectedAccount.__id ?? '',
          db: getDB(),
        })
        .subscribe(getFlowObserver());
      flowSubscription.current = subscription;
    } catch (error) {
      console.log(error);
      console.log('Failed to derive address');
    }
  }, [selectedAccount]);

  useEffect(() => {
    if (selectedAccount) {
      getWalletAddress();
    }
    return cleanUp;
  }, [selectedAccount]);

  return { derivedAddress, isLoading };
};
