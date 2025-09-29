import { Container } from '@cypherock/cysync-ui';
import React, { useMemo, useState } from 'react';

import { useBuySell2 } from '~/context/buySell2';
import { selectLanguage, useAppSelector } from '~/store';

import { Header } from './components/Header';
import { pageMap } from './pages';

import { MainAppLayout } from '../Layout';

export const BuySell2 = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.buySell2;

  const [topbarHeight, setTopbarHeight] = useState(0);

  const { currentPage } = useBuySell2();

  const currentComponent = useMemo(() => pageMap[currentPage], [currentPage]);

  return (
    <MainAppLayout
      topbar={{ title: strings.title }}
      onTopbarHeightChange={setTopbarHeight}
    >
      <Container
        gap={16}
        py={2}
        direction="column"
        height="full"
        justify="flex-start"
      >
        <Header />
        {currentComponent({ topbarHeight })}
      </Container>
    </MainAppLayout>
  );
};
