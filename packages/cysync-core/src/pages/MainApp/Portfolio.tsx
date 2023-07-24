import { Container, Flex } from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { openWalletActionsDialog } from '~/actions';
import { Topbar } from '~/components';
import { AssetAllocation } from '~/pages/MainApp/Components/AssetAllocation';
import { selectLanguage, useAppSelector } from '~/store';

import { SideBar } from './Components';

export const Portfolio: FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(openWalletActionsDialog());
  }, []);

  return (
    <Container height="screen" display="flex">
      <SideBar />
      <Flex direction="column" grow={1} $alignSelf="start">
        <Topbar title={strings.portfolio.title} />
        <AssetAllocation />
      </Flex>
    </Container>
  );
};
