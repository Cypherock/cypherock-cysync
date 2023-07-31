import { Flex } from '@cypherock/cysync-ui';
import React, { FC, ReactNode } from 'react';

import { AppUpdateBar, Topbar } from '~/components';

import { SideBar } from './SideBar';
import styled from 'styled-components';

interface MainAppLayoutProps {
  title: string;
  children?: ReactNode;
}

const MainAppLayoutStyle = styled.div<MainAppLayoutProps>`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.palette.background.content};
`;

export const MainAppLayout: FC<MainAppLayoutProps> = ({ ...props }) => (
  <MainAppLayoutStyle {...props}>
    <SideBar />
    <Flex width="full" direction="column">
      <Flex direction="column" gap={16}>
        <AppUpdateBar />
        <Topbar title={props.title} />
      </Flex>
      <Flex direction="column" gap={16} p="20">
        {props.children}
      </Flex>
    </Flex>
  </MainAppLayoutStyle>
);

MainAppLayout.defaultProps = {
  children: undefined,
};
