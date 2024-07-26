import React from 'react';
import { LoaderDialog } from '~/components';
import { InheritanceExecutorMessageLayout } from '../Layout';
import { useInheritanceExecutorMessageDialog } from '../context';

export const FetchData = () => {
  const { onClose } = useInheritanceExecutorMessageDialog();

  return (
    <InheritanceExecutorMessageLayout onClose={onClose}>
      <LoaderDialog />
    </InheritanceExecutorMessageLayout>
  );
};
