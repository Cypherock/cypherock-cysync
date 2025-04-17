import React, { useEffect, useRef, useState } from 'react';

import { openReceiveDialog } from '~/actions';
import { ErrorHandlerDialog, LoaderDialog } from '~/components';
import { createCustomError, useSwap } from '~/context';
import { useAppDispatch } from '~/store';

export const SwapReceive = () => {
  const dispatch = useAppDispatch();
  const {
    toAccount,
    toNextPage,
    initiateExchange,
    error,
    reset,
    retryCurrentPage,
  } = useSwap();
  const [pageError, setPageError] = useState<any>();

  const receiversAddress = useRef<string>();

  const getReceiveAddress = (address: string) => {
    receiversAddress.current = address;
  };

  const onReceiveFlowClosed = async () => {
    if (receiversAddress.current === undefined) {
      setPageError(createCustomError('Receive flow was not successful'));
      return;
    }
    await initiateExchange(receiversAddress.current);
    toNextPage();
  };

  useEffect(() => {
    if (toAccount === undefined) {
      setPageError(createCustomError('Account not selected'));
      return;
    }
    dispatch(
      openReceiveDialog({
        walletId: toAccount.walletId,
        accountId: toAccount.__id,
        skipSelection: true,
        storeReceiveAddress: getReceiveAddress,
        onClose: onReceiveFlowClosed,
      }),
    );
  }, []);

  return (
    <ErrorHandlerDialog
      error={pageError ?? error}
      onClose={reset}
      onRetry={retryCurrentPage}
      noDelay
    >
      <LoaderDialog />
    </ErrorHandlerDialog>
  );
};
