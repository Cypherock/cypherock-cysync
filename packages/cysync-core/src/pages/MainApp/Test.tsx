import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { openSendDialog } from '~/actions';
import { BitcoinTransaction } from '~/dialogs/Send/Dialogs';
import { useAppDispatch } from '~/store';

export const Test: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openSendDialog());
  }, []);

  return (
    <Container height="screen" display="flex">
      {/* <SideBar /> */}
      <Flex direction="column" grow={1} $alignSelf="start">
        {/* <Topbar />
        <AssetAllocation /> */}
        {/* <Receive /> */}
        {/* HERLLO */}

        <BitcoinTransaction />
      </Flex>
    </Container>
  );
};
