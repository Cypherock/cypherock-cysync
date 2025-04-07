import React from 'react';
import { Container } from '@cypherock/cysync-ui';
import { LoaderDialog } from '~/components';

export const template = () => {
  return (
    <Container width="full" height="full">
      <LoaderDialog />
    </Container>
  );
};
