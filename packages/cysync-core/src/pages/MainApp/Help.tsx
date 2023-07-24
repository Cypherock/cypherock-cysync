import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { Topbar } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { SideBar } from './Components';

export const Help: FC = () => {
  const { strings } = useAppSelector(selectLanguage);

  return (
    <Container height="screen" display="flex">
      <SideBar />
      <Flex direction="column" grow={1} $alignSelf="start">
        <Topbar title={strings.sidebar.help} />
      </Flex>
    </Container>
  );
};
