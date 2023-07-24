import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { Topbar } from '~/components';
import { useQuery } from '~/hooks';
import { selectLanguage, selectWallets, useAppSelector } from '~/store';

import { SideBar } from './Components';

export const Wallet: FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { wallets } = useAppSelector(selectWallets);
  const query = useQuery();
  const walletName = wallets.find(
    wallet => wallet.__id === query.get('id'),
  )?.name;

  return (
    <Container height="screen" display="flex">
      <SideBar />
      <Flex direction="column" grow={1} $alignSelf="start">
        <Topbar title={`${strings.wallet.title} ${walletName}`} />
      </Flex>
    </Container>
  );
};
