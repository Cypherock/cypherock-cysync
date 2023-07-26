import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { openReceiveDialog } from '~/actions';

import { RecipientError } from '~/dialogs/SendGuide/Dialogs/RecipientError';

export const Test: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(openReceiveDialog());
  }, []);

  return (
    <Container height="screen" display="flex">
      {/* <SideBar /> */}
      <Flex direction="column" grow={1} $alignSelf="start">
        {/* <Topbar />
        <AssetAllocation /> */}
        {/* <Receive /> */}
        {/* HERLLO */}
        <RecipientError />
      </Flex>
    </Container>
  );
};
