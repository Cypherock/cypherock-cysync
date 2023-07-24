import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { openReceiveGuideDialog } from '~/actions';

import { ReceiveVerifyAddress } from '~/dialogs/Receive/Dialogs/Receive';

export const Test: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(openReceiveGuideDialog());
  }, []);

  return (
    <Container height="screen" display="flex">
      {/* <SideBar /> */}
      <Flex direction="column" grow={1} $alignSelf="start">
        {/* <Topbar />
        <AssetAllocation /> */}
        {/* <Receive /> */}
        {/* HERLLO */}
        <ReceiveVerifyAddress />
      </Flex>
    </Container>
  );
};
