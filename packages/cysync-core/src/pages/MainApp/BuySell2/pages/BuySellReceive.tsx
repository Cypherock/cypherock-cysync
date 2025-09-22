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
    reset,
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

  // const { strings } = useAppSelector(selectLanguage);
  // const displayText = {
  //   errors: {
  //     notSuccessful: 'Receive flow was not successful',
  //     invalidInputs: 'Invalid inputs for initiating Exchange',
  //     accountNotSelected: 'Account not selected',
  //   },
  // };

  const onReceiveFlowClosed = async () => {
    if (receiversAddress.current === undefined) {
      // TODO: error handling
      // onError(createCustomError(displayText.errors.notSuccessful));
      // await closeExchange();
      reset();
      return;
    }

    await createOrder(receiversAddress.current);
    if (order.current === undefined) {
      reset();
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
        isVerificationRequired: true,
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
