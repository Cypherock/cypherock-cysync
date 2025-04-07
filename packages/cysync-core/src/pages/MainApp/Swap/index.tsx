import React, { useMemo } from 'react';

import { SwapPage, useSwap } from '~/context';

import { MainAppLayout } from '../Layout';
import { SwapDetailsInput } from './Pages/SwapDetailsInput';
import { SwapSummary } from './Pages/SwapSummary';

const pageMap: Record<SwapPage, React.JSX.Element> = {
  [SwapPage.DETAILS]: <SwapDetailsInput />,
  [SwapPage.SUMMARY]: <SwapSummary />,
  [SwapPage.RECEIVE]: <div></div>,
  [SwapPage.SEND]: <div></div>,
  [SwapPage.STATUS]: <div></div>,
};

export const Swap = () => {
  const { currentPage } = useSwap();

  const currentComponent = useMemo(() => pageMap[currentPage], [currentPage]);

  return (
    <MainAppLayout topbar={{ title: 'Swap' }}>{currentComponent}</MainAppLayout>
  );
};
