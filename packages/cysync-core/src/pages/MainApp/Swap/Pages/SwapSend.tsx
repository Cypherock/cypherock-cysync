import React, { useEffect } from 'react';

import { openSendDialog } from '~/actions';
import { LoaderDialog } from '~/components';
import { createCustomError, useSwap } from '~/context';
import { SendFlowSource } from '~/dialogs/Send/context';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

const SWAP_SEND_VALIDITY_CHECK_INTERVAL_MS = 5000;

export const SwapSend = () => {
  const dispatch = useAppDispatch();
  const {
    fromAccount,
    toNextPage,
    exchangeDetails,
    quote,
    onError,
    closeExchange,
    markTransactionAsSwap,
    transactionId,
  } = useSwap();
  const { strings } = useAppSelector(selectLanguage);
  const displayText = strings.swap.swapSend;

  const storeTransactionId = (id: string) => {
    transactionId.current = id;
  };

  const onSendFlowClose = async () => {
    if (transactionId.current === undefined) {
      onError(createCustomError(displayText.errors.notSuccessfull));
    } else {
      markTransactionAsSwap(transactionId.current);
      toNextPage();
    }
    await closeExchange();
  };

  const onSendDialogError = async (e?: any) => {
    onError(e);
    dispatch(closeDialog('sendDialog'));
    await closeExchange();
  };

  useEffect(() => {
    if (!exchangeDetails) return undefined;

    const validTill = new Date(exchangeDetails.validTill).getTime();
    const intervalId = setInterval(() => {
      if (Date.now() > validTill) {
        onSendDialogError(
          createCustomError(
            strings.swap.commonErrors.timeout.title,
            strings.swap.commonErrors.timeout.description,
          ),
        );
      }
    }, SWAP_SEND_VALIDITY_CHECK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [exchangeDetails, onSendDialogError, strings]);

  useEffect(() => {
    const abort = async () => {
      await closeExchange();
      onError(
        createCustomError(
          displayText.errors.cannotStart,
          displayText.errors.invalidPrerequisite,
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
        providerName: exchangeDetails.provider.name,
      }),
    );
  }, []);

  return <LoaderDialog />;
};
