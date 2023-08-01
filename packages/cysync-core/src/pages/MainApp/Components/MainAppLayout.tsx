import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC, ReactNode } from 'react';

import { AppUpdateBar, Topbar } from '~/components';

import { SideBar } from './SideBar';

interface MainAppLayoutProps {
  title: string;
  children?: ReactNode;
}

export const MainAppLayout: FC<MainAppLayoutProps> = ({ title, children }) => (
  <Container height="screen" display="flex" $bgColor="contentGradient">
    <SideBar />
    <Flex direction="column" grow={1} $alignSelf="start">
      <Flex direction="column" gap={16}>
        <AppUpdateBar />
        <Topbar title={title} />
      </Flex>
      <Flex direction="column" gap={16} p="20">
        {children}
      </Flex>
    </Flex>
  </Container>
);

MainAppLayout.defaultProps = {
  children: undefined,
};
