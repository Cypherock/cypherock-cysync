import React from 'react';
import { Flex } from '../../atoms';

export const SidebarHandle: React.FC = () => (
  <Flex
    $borderColor="topbar"
    $borderWidthX={1}
    align="center"
    justify="center"
    width="7px"
  >
    <span
      style={{
        width: '1px',
        height: '24px',
        borderRadius: '2px',
        background: '#cbc4b9',
      }}
    />
  </Flex>
);
