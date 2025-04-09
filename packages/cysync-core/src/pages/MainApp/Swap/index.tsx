import React, { useMemo } from 'react';

import { SwapPage, useSwap } from '~/context';

import { SwapDetailsInput } from './Pages/SwapDetailsInput';
import { SwapReceive } from './Pages/SwapReceive';
import { SwapSend } from './Pages/SwapSend';
import { SwapStatus } from './Pages/SwapStatus';
import { SwapSummary } from './Pages/SwapSummary';

import { MainAppLayout } from '../Layout';

const pageMap: Record<SwapPage, React.JSX.Element> = {
  [SwapPage.DETAILS]: <SwapDetailsInput />,
  [SwapPage.SUMMARY]: <SwapSummary />,
  [SwapPage.RECEIVE]: <SwapReceive />,
  [SwapPage.SEND]: <SwapSend />,
  [SwapPage.STATUS]: <SwapStatus />,
};

export const Swap = () => {
  const { currentPage } = useSwap();

  const currentComponent = useMemo(() => pageMap[currentPage], [currentPage]);

  return (
    <MainAppLayout topbar={{ title: 'Swap' }}>{currentComponent}</MainAppLayout>
  );
};
