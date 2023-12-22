import React from 'react';

import { GraphHeaderSkeleton } from './GraphHeaderSkeleton';
import { GraphSummarySkeleton } from './GraphSummarySkeleton';

import { Container, Flex } from '../../atoms';

export const DisplayGraphSkeleton = () => (
  <Flex
    direction="column"
    display="flex"
    $bgColor="primary"
    $borderRadius={24}
    $borderStyle="none"
  >
    <GraphHeaderSkeleton />
    <GraphSummarySkeleton />
    <Container height={300} width="full" mb={3} pt={1} px={{ def: 3, lg: 5 }}>
      <Container
        height="full"
        animate="skeleton"
        width="full"
        $borderRadius="0 0 24px 24px"
      />
    </Container>
  </Flex>
);
