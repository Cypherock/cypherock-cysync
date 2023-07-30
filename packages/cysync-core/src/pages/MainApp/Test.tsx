import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { openSendGuideDialog } from '~/actions';

export const Test: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(openSendGuideDialog());
  }, []);

  return (
    <Container height="screen" display="flex">
      {/* <SideBar /> */}
      <Flex direction="column" grow={1} $alignSelf="start">
        {/* <Topbar />
        <AssetAllocation /> */}
        {/* <Receive /> */}
        {/* HERLLO */}
        {/* <ConnectDevice/> */}
      </Flex>
    </Container>
  );
};
