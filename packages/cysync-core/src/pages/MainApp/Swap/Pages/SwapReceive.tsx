import React, { useEffect, useRef, useState } from 'react';
import { Container } from '@cypherock/cysync-ui';
import { ErrorHandlerDialog, LoaderDialog } from '~/components';
import { useAppDispatch } from '~/store';
import { openReceiveDialog } from '~/actions';
import { useSwap } from '~/context';

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
      setPageError(new Error('Receiver address not available'));
      return;
    }
    await initiateExchange(receiversAddress.current);
    toNextPage();
  };

  useEffect(() => {
    if (toAccount === undefined) {
      setPageError(new Error('Account not selected'));
      return;
    }
    dispatch(
      openReceiveDialog({
        walletId: toAccount?.walletId,
        accountId: toAccount?.__id,
        skipSelection: true,
        storeReceiveAddress: getReceiveAddress,
        onClose: onReceiveFlowClosed,
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
