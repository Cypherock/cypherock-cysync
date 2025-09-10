import { Container } from '@cypherock/cysync-ui';
import React, { useEffect, useLayoutEffect } from 'react';

import { ErrorHandlerDialog, LoaderDialog } from '~/components';
import { BuySellState, useBuySell } from '~/context';
import { analyticsService, ANALYTICS_EVENTS } from '~/services/analytics';
import { selectLanguage, useAppSelector } from '~/store';

import { BuySellAccountSelector } from './AccountSelector';
import { BuySellCurrencySelector } from './CurrencySelector';
import { BuySellOrder } from './Order';

import { MainAppLayout } from '../Layout';

export const BuySell = () => {
  const lang = useAppSelector(selectLanguage);
  const { init, isInitializing, unhandledError, reset, state, onRetry } =
    useBuySell();

  useEffect(() => {
    analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_FLOW_STARTED);
  }, []);

  useEffect(() => {
    switch (state) {
      case BuySellState.CURRENCY_SELECT:
        analyticsService.trackEvent(
          ANALYTICS_EVENTS.BUY_CRYPTO_CURRENCY_PAGE_VIEWED,
        );
        break;
      case BuySellState.ACCOUNT_SELECT:
        analyticsService.trackEvent(
          ANALYTICS_EVENTS.BUY_CRYPTO_ACCOUNT_PAGE_VIEWED,
        );
        break;
      case BuySellState.ORDER:
        analyticsService.trackEvent(
          ANALYTICS_EVENTS.BUY_CRYPTO_ORDER_PAGE_VIEWED,
        );
        break;
      default:
        break;
    }
  }, [state]);

  useLayoutEffect(() => {
    reset();
    init();
  }, []);

  const stateToComponent: Record<BuySellState, React.FC> = {
    [BuySellState.CURRENCY_SELECT]: BuySellCurrencySelector,
    [BuySellState.ACCOUNT_SELECT]: BuySellAccountSelector,
    [BuySellState.ORDER]: BuySellOrder,
  };

  const getMainContent = () => {
    if (isInitializing) {
      return <LoaderDialog />;
    }

    const Component = stateToComponent[state];
    if (!Component) return null;

    return <Component />;
  };

  return (
    <MainAppLayout topbar={{ title: lang.strings.onramp.title }}>
      <Container width="full" height="full">
        <ErrorHandlerDialog
          error={unhandledError}
          onClose={reset}
          onRetry={onRetry}
          noDelay
        >
          {getMainContent()}
        </ErrorHandlerDialog>
      </Container>
    </MainAppLayout>
  );
};
