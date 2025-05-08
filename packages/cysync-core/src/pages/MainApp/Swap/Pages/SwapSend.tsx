import React, { useEffect, useRef } from 'react';

import { openSendDialog } from '~/actions';
import { LoaderDialog } from '~/components';
import { createCustomError, useSwap } from '~/context';
import { SendFlowSource } from '~/dialogs/Send/context';
import { closeDialog, useAppDispatch } from '~/store';

export const SwapSend = () => {
  const dispatch = useAppDispatch();
  const {
    fromAccount,
    toNextPage,
    exchangeDetails,
    quote,
    onError,
    closeExchange,
  } = useSwap();
  const transactionId = useRef<string>();

  const storeTransactionId = (id: string) => {
    transactionId.current = id;
  };

  const onSendFlowClose = async () => {
    if (transactionId.current === undefined) {
      onError(createCustomError('Send flow was not successful'));
      await closeExchange();
      return;
    }
    toNextPage();
  };

  const onSendDialogError = async (e?: any) => {
    onError(e);
    dispatch(closeDialog('sendDialog'));
    await closeExchange();
  };

  useEffect(() => {
    const abort = async () => {
      await closeExchange();
      onError(
        createCustomError(
          'Cannot start send flow',
          'invalid prerequisite for swap send',
        ),
      );
    };
    if (
      fromAccount === undefined ||
      exchangeDetails === undefined ||
      quote === undefined
    ) {
      abort();
      return;
    }

    dispatch(
      openSendDialog({
        source: SendFlowSource.SWAP,
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
        onError: onSendDialogError,
        validTill: exchangeDetails.validTill,
      }),
    );
  }, []);

  return <LoaderDialog />;
};
