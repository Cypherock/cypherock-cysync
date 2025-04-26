import { getCoinSupport } from '@cypherock/coin-support';
import { ExchangeApp } from '@cypherock/sdk-app-exchange';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import React, { useEffect, useRef, useState } from 'react';

import { openReceiveDialog } from '~/actions';
import { ErrorHandlerDialog, LoaderDialog } from '~/components';
import { createCustomError, useSwap } from '~/context';
import { DeviceTask, useDeviceTask } from '~/hooks';
import { useAppDispatch } from '~/store';

export const SwapReceive = () => {
  const dispatch = useAppDispatch();
  const {
    toAccount,
    fromAccount,
    toNextPage,
    initiateExchange,
    error,
    reset,
    retryCurrentPage,
    closeExchange,
  } = useSwap();
  const [pageError, setPageError] = useState<any>();

  const receiversAddress = useRef<string>();

  const getReceiveAddress = (address: string) => {
    receiversAddress.current = address;
  };

  const onReceiveFlowClosed = async () => {
    if (receiversAddress.current === undefined) {
      await closeExchange();
      setPageError(createCustomError('Receive flow was not successful'));
      return;
    }
    await initiateExchange(receiversAddress.current);
    toNextPage();
  };

  const initiateExchangeFlowTask: DeviceTask<void> = async connection => {
    if (fromAccount === undefined || toAccount === undefined) {
      setPageError(createCustomError('Invalid inputs for initiating Exchange'));
      return;
    }

    const app = await ExchangeApp.create(connection);
    await app.initiateFlow({
      from: {
        appletId: getCoinSupport(fromAccount.familyId).getAppId(),
        walletId: hexToUint8Array(fromAccount.walletId),
      },
      to: {
        appletId: getCoinSupport(toAccount.familyId).getAppId(),
        walletId: hexToUint8Array(toAccount.walletId),
      },
    });
  };

  const initiateTask = useDeviceTask(initiateExchangeFlowTask, {
    dontExecuteTask: true,
  });

  const init = async () => {
    const result = await initiateTask.run();

    if (result.error) {
      setPageError(result.error);
      return;
    }

    if (toAccount === undefined) {
      await closeExchange();
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
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <ErrorHandlerDialog
      error={initiateTask.error ?? pageError ?? error}
      onRetry={retryCurrentPage}
      onClose={reset}
      showCloseButton
      suppressActions={false}
      noDelay
    >
      <LoaderDialog />
    </ErrorHandlerDialog>
  );
};
