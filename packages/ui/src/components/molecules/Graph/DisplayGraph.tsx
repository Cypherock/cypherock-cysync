import React from 'react';

import { GraphHeader, GraphHeaderProps } from './GraphHeader';
import { GraphSummary, GraphSummaryProps } from './GraphSummary';
import { LineGraph, LineGraphProps } from './LineGraph';

import { Container, Flex, Throbber } from '../../atoms';

export interface DisplayGraphProps
  extends GraphHeaderProps,
    GraphSummaryProps,
    LineGraphProps {}

export const DisplayGraph: React.FC<DisplayGraphProps> = props => {
  const { isLoading } = props;

  return (
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
        {isLoading && (
          <Container
            height="full"
            width="full"
            pt={1}
            px={{ def: 3, lg: 5 }}
            position="absolute"
            top={0}
            left={0}
            $zIndex={10}
            opacity={0.6}
            $bgColor="primary"
          >
            <Throbber size={40} strokeWidth={3} />
          </Container>
        )}
      </Container>
    </Flex>
  );
};
