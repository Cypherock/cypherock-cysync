import React from 'react';

import { Container } from '../../atoms';

export const GraphSummarySkeleton: React.FC = () => (
  <Container pt={2} px={{ def: 3, lg: 5 }} width="full">
    <Container height={41} animate="skeleton" width="full" />
  </Container>
);
