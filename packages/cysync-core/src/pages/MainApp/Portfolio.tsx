import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { openWalletActionsDialog } from '~/actions';
import { AppUpdateBar, Topbar } from '~/components';
import { AssetAllocation } from '~/pages/MainApp/Components/AssetAllocation';

import { SideBar } from './Components';

export const Portfolio: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(openWalletActionsDialog());
  }, []);

  return (
    <Container height="screen" display="flex">
      <SideBar />
      <Flex direction="column" grow={1} $alignSelf="start">
        <AppUpdateBar />
        <Topbar />
        <AssetAllocation />
      </Flex>
    </Container>
  );
};
