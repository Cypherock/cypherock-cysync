import React, { useEffect } from 'react';
import { Container } from '@cypherock/cysync-ui';
import { LoaderDialog } from '~/components';
import { useAppDispatch } from '~/store';
import { openReceiveDialog } from '~/actions';
import { useSwap } from '~/context';

export const SwapReceive = () => {
  const dispatch = useAppDispatch();
  const { toAccount, toNextPage, initiateExchange } = useSwap();

  const getReceiveAddress = async (address: string) => {
    console.log({ throughreceiveflow: address });
    await initiateExchange(address);
    toNextPage();
  };

  useEffect(() => {
    dispatch(
      openReceiveDialog({
        walletId: toAccount?.walletId,
        accountId: toAccount?.__id,
        skipSelection: true,
        storeReceiveAddress: getReceiveAddress,
      }),
    );
  }, []);

  return (
    <Container width="full" height="full">
      <LoaderDialog />
    </Container>
  );
};
