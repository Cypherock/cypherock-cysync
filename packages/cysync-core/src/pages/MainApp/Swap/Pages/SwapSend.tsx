import React, { useEffect } from 'react';
import { Container } from '@cypherock/cysync-ui';
import { LoaderDialog } from '~/components';
import { useAppDispatch } from '~/store';
import { openSendDialog } from '~/actions';
import { useSwap } from '~/context';

export const SwapSend = () => {
  const dispatch = useAppDispatch();
  const { fromAccount, exchangeDetails, quote } = useSwap();

  useEffect(() => {
    dispatch(
      openSendDialog({
        walletId: fromAccount?.walletId,
        accountId: fromAccount?.__id,
        prefillDetails: {
          address: exchangeDetails?.address,
          amount: quote?.fromAmount,
        },
        skipAccountSelection: true,
        disableAccountSelection: true,
      }),
    );
  }, []);

  return (
    <Container width="full" height="full">
      <LoaderDialog />
    </Container>
  );
};
