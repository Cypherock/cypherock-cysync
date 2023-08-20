import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { useAppDispatch } from '~/store';
import { openSendDialog } from '~/actions';
import { FilterMenu } from './Components';

export const Test: FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openSendDialog());
  }, []);

  return (
    <Container height="screen" display="flex">
      <Flex direction="column" grow={1} $alignSelf="start">
        <FilterMenu />
      </Flex>
    </Container>
  );
};
