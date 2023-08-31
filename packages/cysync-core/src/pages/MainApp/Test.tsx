import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';

import { openSendDialog } from '~/actions';
import { useAppDispatch } from '~/store';

export const Test: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openSendDialog());
  }, []);

  return (
    <Container height="screen" display="flex">
      <Flex align="center" direction="row" gap={16} />
    </Container>
  );
};
