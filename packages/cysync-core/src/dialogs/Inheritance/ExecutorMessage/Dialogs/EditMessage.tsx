import React, { useEffect, useState } from 'react';
import { InheritanceExecutorMessageLayout } from '../Layout';
import { useInheritanceExecutorMessageDialog } from '../context';
import { LoaderDialog } from '~/components';

export const EditMessage = () => {
  const [loading, setLoading] = useState(false);
  const { onClose } = useInheritanceExecutorMessageDialog();

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <InheritanceExecutorMessageLayout onClose={onClose}>
      {loading && <LoaderDialog />}
    </InheritanceExecutorMessageLayout>
  );
};
