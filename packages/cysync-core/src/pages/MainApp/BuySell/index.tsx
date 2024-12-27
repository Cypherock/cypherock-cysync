import { Container } from '@cypherock/cysync-ui';
import React, { useLayoutEffect } from 'react';

import { ErrorHandlerDialog, LoaderDialog } from '~/components';
import { BuySellState, useBuySell } from '~/context';
import { selectLanguage, useAppSelector } from '~/store';

import { BuySellAccountSelector } from './AccountSelector';
import { BuySellCurrencySelector } from './CurrencySelector';
import { BuySellOrder } from './Order';

import { MainAppLayout } from '../Layout';

export const BuySell = () => {
  const lang = useAppSelector(selectLanguage);
  const { init, isInitializing, unhandledError, reset, state, onRetry } =
    useBuySell();

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
