import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { useAppDispatch } from '~/store';
import { openSendDialog } from '~/actions';

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
