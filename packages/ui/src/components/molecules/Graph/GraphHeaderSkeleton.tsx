import React from 'react';

import { Container } from '../../atoms';

export const GraphHeaderSkeleton: React.FC = () => (
  <Container
    pt={4}
    px={{ def: 3, lg: 5 }}
    pb={2}
    $borderColor="popup"
    $borderWidthB={1}
    $borderStyle="solid"
  >
    <Container
      height={125}
      animate="skeleton"
      width="full"
      $borderRadius="24px 24px 0 0"
    />
  </Container>
);
