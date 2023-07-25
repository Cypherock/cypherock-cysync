import React, { FC } from 'react';

import { useQuery } from '~/hooks';
import { selectLanguage, selectWallets, useAppSelector } from '~/store';

import { MainAppLayout } from './Components';

export const Wallet: FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { wallets } = useAppSelector(selectWallets);
  const query = useQuery();
  const walletName = wallets.find(
    wallet => wallet.__id === query.get('id'),
  )?.name;

  return <MainAppLayout title={`${strings.wallet.title} ${walletName}`} />;
};
