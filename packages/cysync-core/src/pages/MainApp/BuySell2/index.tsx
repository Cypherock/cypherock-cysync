import { Container } from '@cypherock/cysync-ui';
import React, { useEffect, useMemo, useState } from 'react';

import { useBuySell2 } from '~/context/buySell2';
import { ANALYTICS_EVENTS, analyticsService } from '~/services/analytics';
import { selectLanguage, useAppSelector } from '~/store';

import { Header } from './components/Header';
import { BuySellPage, pageMap } from './pages';

import { MainAppLayout } from '../Layout';

export const BuySell2 = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.buySell2;

  const [topbarHeight, setTopbarHeight] = useState(0);

  const { currentPage } = useBuySell2();

  const currentComponent = useMemo(() => pageMap[currentPage], [currentPage]);

  useEffect(() => {
    analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_FLOW_STARTED);
  }, []);

  useEffect(() => {
    switch (currentPage) {
      case BuySellPage.Input:
        analyticsService.trackEvent(
          ANALYTICS_EVENTS.BUY_CRYPTO_INPUT_PAGE_VIEWED,
        );
        break;
      case BuySellPage.History:
        analyticsService.trackEvent(
          ANALYTICS_EVENTS.BUY_CRYPTO_HISTORY_PAGE_VIEWED,
        );
        break;
      case BuySellPage.Receive:
        analyticsService.trackEvent(
          ANALYTICS_EVENTS.BUY_CRYPTO_RECEIVE_PAGE_VIEWED,
        );
        break;
      case BuySellPage.Webview:
        analyticsService.trackEvent(
          ANALYTICS_EVENTS.BUY_CRYPTO_WEBVIEW_PAGE_VIEWED,
        );
        break;
      default:
        break;
    }
  }, [currentPage]);

  return (
    <MainAppLayout
      topbar={{ title: strings.title }}
      onTopbarHeightChange={setTopbarHeight}
    >
      <Container
        gap={16}
        pb={2}
        direction="column"
        height="full"
        justify="flex-start"
        align="flex-start"
        $overflow="hidden"
      >
        <Header />
        {currentComponent({ topbarHeight })}
      </Container>
    </MainAppLayout>
  );
};
