import { Container } from '@cypherock/cysync-ui';
import React, { useEffect, useRef, useState } from 'react';

import { openSendDialog } from '~/actions';
import { ErrorHandlerDialog, LoaderDialog } from '~/components';
import { useSwap } from '~/context';
import { useAppDispatch } from '~/store';

export const SwapSend = () => {
  const dispatch = useAppDispatch();
  const {
    fromAccount,
    toNextPage,
    exchangeDetails,
    quote,
    error,
    reset,
    retryCurrentPage,
  } = useSwap();
  const [pageError, setPageError] = useState<any>();
  const transactionId = useRef<string>();

  const storeTransactionId = (id: string) => {
    console.log({ id });
    transactionId.current = id;
  };

  const onSendFlowClose = () => {
    if (transactionId.current === undefined) {
      setPageError(new Error('Failed to send transaction'));
      return;
    }
    toNextPage();
  };

  useEffect(() => {
    if (
      fromAccount === undefined ||
      exchangeDetails === undefined ||
      quote === undefined
    ) {
      setPageError(new Error('invalid prerequisite for swap send'));
      return;
    }

    dispatch(
      openSendDialog({
        walletId: fromAccount.walletId,
        accountId: fromAccount.__id,
        prefillDetails: {
          address: exchangeDetails.address,
          amount: quote.fromAmount,
          extraInput: exchangeDetails.additionalData,
        },
        skipAccountSelection: true,
        disableAccountSelection: true,
        storeTransactionId,
        onClose: onSendFlowClose,
      }),
    );
  }, []);

  return (
    <Container width="full" height="full">
      <ErrorHandlerDialog
        error={pageError ?? error}
        onClose={reset}
        onRetry={retryCurrentPage}
        noDelay
      >
        <LoaderDialog />
      </ErrorHandlerDialog>
    </Container>
  );
};
