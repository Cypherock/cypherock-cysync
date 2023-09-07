import React from 'react';

import { GraphHeader, GraphHeaderProps } from './GraphHeader';
import { GraphSummary, GraphSummaryProps } from './GraphSummary';
import { LineGraph } from './LineGraph';

import { Flex } from '../../atoms';

export interface DisplayGraphProps
  extends GraphHeaderProps,
    GraphSummaryProps {}

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

    <LineGraph />
  </Flex>
);
