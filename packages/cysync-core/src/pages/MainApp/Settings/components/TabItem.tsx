import React from 'react';
import { Divider, Flex } from '@cypherock/cysync-ui';

export interface TabItemProps {
  children: [React.ReactNode, React.ReactNode];
}

export const TabItem: React.FC<TabItemProps> = ({ children }) => (
  <Flex gap={32} align="stretch" direction="column">
    <Flex justify="space-between" align="center">
      {children}
    </Flex>
    <Divider variant="horizontal" />
  </Flex>
);
