import { Flex } from '@cypherock/cysync-ui';
import {} from '@cypherock/sdk-app-exchange';
import React, { useEffect, useRef } from 'react';

import { openReceiveDialog } from '~/actions';
import { LoaderDialog } from '~/components';
import { useBuySell2 } from '~/context/buySell2';
import { ReceiveFlowSource } from '~/dialogs/Receive/context';
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

  const onReceiveFlowClosed = async () => {
    if (receiversAddress.current === undefined) {
      // TODO: show error to user
      return;
    }

    await createOrder(receiversAddress.current);
    if (order.current === undefined) {
      // TODO: show error to user
      return;
    }

    toNextPage();
  };

  const init = async () => {
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
