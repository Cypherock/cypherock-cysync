import React from 'react';

import { GraphHeader, GraphHeaderProps } from './GraphHeader';
import { GraphSummary, GraphSummaryProps } from './GraphSummary';
import { LineGraph, LineGraphProps } from './LineGraph';

import { Container, Flex } from '../../atoms';

export interface DisplayGraphProps
  extends GraphHeaderProps,
    GraphSummaryProps,
    LineGraphProps {}

export const DisplayGraph: React.FC<DisplayGraphProps> = props => (
  <Flex
    direction="column"
    display="flex"
    $bgColor="primary"
    $borderRadius={24}
    $borderStyle="none"
  >
    <GraphHeader {...props} />
    <GraphSummary {...props} />
    <Container height={300} position="relative" width="full" mb={3}>
      <LineGraph {...props} />
    </Container>
  </Flex>
);
