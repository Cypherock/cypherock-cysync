import { Flex } from '@cypherock/cysync-ui';
import {} from '@cypherock/sdk-app-exchange';
import React, { useEffect, useRef } from 'react';

import { openReceiveDialog } from '~/actions';
import { LoaderDialog } from '~/components';
import { useBuySell2 } from '~/context/buySell2';
import { ReceiveFlowSource } from '~/dialogs/Receive/context';
import { ANALYTICS_EVENTS, analyticsService } from '~/services';
import { useAppDispatch } from '~/store';

export const BuySellReceive = () => {
  const dispatch = useAppDispatch();

  const {
    selectedWallet,
    order,
    toNextPage,
    createOrder,
    selectedAccount,
    toPreviousPage,
    setNavigationOptions,
    selectedCrypto,
    selectedFiatCurrency,
  } = useBuySell2();

  const receiversAddress = useRef<string>();
  const storeReceiveAddress = (address: string) => {
    receiversAddress.current = address;
  };

  useEffect(() => {
    setNavigationOptions({
      onBack: toPreviousPage,
    });

    return () => {
      setNavigationOptions({});
    };
  }, [toPreviousPage]);

  const onReceiveFlowClosed = async (discardFlow?: boolean) => {
    if (receiversAddress.current === undefined || discardFlow) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_FAILED, {
        fromAsset: selectedFiatCurrency?.code,
        toAsset: selectedCrypto?.assetId,
        step: 'receive_address_generation',
        error: 'No address received',
      });
      toPreviousPage();
      return;
    }

    analyticsService.trackEvent(
      ANALYTICS_EVENTS.BUY_CRYPTO_RECEIVE_FLOW_CLOSED,
      {
        fromAsset: selectedFiatCurrency?.code,
        toAsset: selectedCrypto?.assetId,
      },
    );

    await createOrder(receiversAddress.current);
    if (order.current === undefined) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_FAILED, {
        fromAsset: selectedFiatCurrency?.code,
        toAsset: selectedCrypto?.assetId,
        step: 'create_order',
        error: 'No order created',
      });
      toPreviousPage();
      return;
    }

    toNextPage();
  };

  const init = async () => {
    analyticsService.trackEvent(
      ANALYTICS_EVENTS.BUY_CRYPTO_RECEIVE_FLOW_STARTED,
      {
        fromAsset: selectedFiatCurrency?.code,
        toAsset: selectedCrypto?.assetId,
      },
    );
    dispatch(
      openReceiveDialog({
        walletId: selectedWallet?.__id,
        accountId: selectedAccount?.__id,
        skipSelection: true,
        storeReceiveAddress,
        source: ReceiveFlowSource.ONRAMP,
        onClose: onReceiveFlowClosed,
        isVerificationRequired: false,
      }),
    );
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Flex $height="full" $width="full" justify="center" align="center">
      <LoaderDialog />
    </Flex>
  );
};
