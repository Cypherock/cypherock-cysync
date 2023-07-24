import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC, ReactNode } from 'react';

import { Topbar } from '~/components';

import { SideBar } from './SideBar';

interface MainAppLayoutProps {
  title: string;
  children?: ReactNode;
}

export const MainAppLayout: FC<MainAppLayoutProps> = ({ title, children }) => (
  <Container height="screen" display="flex">
    <SideBar />
    <Flex direction="column" grow={1} $alignSelf="start">
      <Topbar title={title} />
      {children}
    </Flex>
  </Container>
);

MainAppLayout.defaultProps = {
  children: undefined,
};
