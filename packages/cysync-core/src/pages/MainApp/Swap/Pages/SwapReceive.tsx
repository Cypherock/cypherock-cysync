import { getCoinSupport } from '@cypherock/coin-support';
import { ExchangeApp } from '@cypherock/sdk-app-exchange';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import React, { useEffect, useRef } from 'react';

import { openReceiveDialog } from '~/actions';
import { LoaderDialog } from '~/components';
import { createCustomError, useSwap } from '~/context';
import { ReceiveFlowSource } from '~/dialogs/Receive/context';
import { DeviceTask, useDeviceTask } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import logger from '~/utils/logger';

const SWAP_RECEIVE_VALIDITY_CHECK_INTERVAL_MS = 5000;
export const SwapReceive = () => {
  const dispatch = useAppDispatch();
  const {
    toAccount,
    fromAccount,
    toNextPage,
    initiateExchange,
    onError,
    closeExchange,
    receiveFlowValidTill,
  } = useSwap();
  const { strings } = useAppSelector(selectLanguage);
  const displayText = strings.swap.swapReceive;

  const receiversAddress = useRef<string>();

  const getReceiveAddress = (address: string) => {
    receiversAddress.current = address;
  };

  const onReceiveFlowClosed = async () => {
    if (receiversAddress.current === undefined) {
      onError(createCustomError(displayText.errors.notSuccessful));
      await closeExchange();
      return;
    }

    await initiateExchange(receiversAddress.current);
    toNextPage();
  };

  const onReceiveDialogError = async (e?: any) => {
    onError(e);
    dispatch(closeDialog('receive'));
    await closeExchange();
  };

  const initiateExchangeFlowTask: DeviceTask<void> = async connection => {
    if (fromAccount === undefined || toAccount === undefined) {
      onError(createCustomError(displayText.errors.invalidInputs));
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
    logger.info(
      `Starting swap from ${fromAccount?.assetId} to ${toAccount?.assetId}`,
    );
    const result = await initiateTask.run();

    if (result.error) {
      onError(result.error);
      return;
    }

    if (initiateTask.error) {
      onError(initiateTask.error);
      return;
    }

    if (toAccount === undefined) {
      onError(createCustomError(displayText.errors.accountNotSelected));
      await closeExchange();
      return;
    }

    dispatch(
      openReceiveDialog({
        walletId: toAccount.walletId,
        accountId: toAccount.__id,
        skipSelection: true,
        storeReceiveAddress: getReceiveAddress,
        onClose: onReceiveFlowClosed,
        source: ReceiveFlowSource.SWAP,
        onError: onReceiveDialogError,
        validTill: receiveFlowValidTill,
      }),
    );
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Date.now() > receiveFlowValidTill) {
        onReceiveDialogError(
          createCustomError(
            strings.swap.commonErrors.timeout.title,
            strings.swap.commonErrors.timeout.description,
          ),
        );
      }
    }, SWAP_RECEIVE_VALIDITY_CHECK_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [strings, receiveFlowValidTill]);

  useEffect(() => {
    init();
  }, []);

  return <LoaderDialog />;
};
