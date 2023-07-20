import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { Topbar } from '~/components';
import { AssetAllocation } from '~/pages/MainApp/Components/AssetAllocation';
import { SideBar } from './Components';

export const Portfolio: FC = () => (
  <Container height="screen" display="flex">
    <SideBar />
    <Flex direction="column" grow={1} $alignSelf="start">
      <Topbar />
      <AssetAllocation />
    </Flex>
  </Container>
);
