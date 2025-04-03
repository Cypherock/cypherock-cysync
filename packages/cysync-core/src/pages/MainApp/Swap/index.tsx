import { Container } from '@cypherock/cysync-ui';
import React, { useMemo, useState } from 'react';

import { ErrorHandlerDialog, LoaderDialog } from '~/components';

import { MainAppLayout } from '../Layout';
import { SwapDetailsInput } from './Pages/SwapDetailsInput';

const componentMap = [<SwapDetailsInput />, <LoaderDialog />, <LoaderDialog />];

export const Swap = () => {
  const [currentIndex] = useState(0);

  const currentComponent = useMemo(
    () => componentMap[currentIndex],
    [currentIndex],
  );

  return (
    <MainAppLayout topbar={{ title: 'Swap' }}>
      <Container width="full" height="full">
        <ErrorHandlerDialog onClose={() => {}} onRetry={() => {}} noDelay>
          {currentComponent}
        </ErrorHandlerDialog>
      </Container>
    </MainAppLayout>
  );
};
