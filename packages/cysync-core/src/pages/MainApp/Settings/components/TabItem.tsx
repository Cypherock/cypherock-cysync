import { Divider, Flex } from '@cypherock/cysync-ui';
import React from 'react';

export interface TabItemProps {
  children: [React.ReactNode, React.ReactNode];
}

export const TabItem: React.FC<TabItemProps> = ({ children }) => (
  <Flex gap={32} align="stretch" direction="column">
    <Flex justify="space-between" gap={32} align="center">
      {children}
    </Flex>
    <Divider variant="horizontal" />
  </Flex>
);
