import React, { useMemo } from 'react';

import { SwapPage, useSwap } from '~/context';

import { SwapDetailsInput } from './Pages/SwapDetailsInput';
import { SwapReceive } from './Pages/SwapReceive';
import { SwapSend } from './Pages/SwapSend';
import { SwapStatus } from './Pages/SwapStatus';
import { SwapSummary } from './Pages/SwapSummary';

import { MainAppLayout } from '../Layout';
import { WithConnectedDevice } from '~/components';
import { Container } from '@cypherock/cysync-ui';

const FullScreenWithConnectedDevice: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Container width="full" height="full">
    <WithConnectedDevice>{children}</WithConnectedDevice>;
  </Container>
);

const pageMap: Record<SwapPage, React.JSX.Element> = {
  [SwapPage.DETAILS]: <SwapDetailsInput />,
  [SwapPage.SUMMARY]: <SwapSummary />,
  [SwapPage.RECEIVE]: (
    <FullScreenWithConnectedDevice>
      <SwapReceive />
    </FullScreenWithConnectedDevice>
  ),
  [SwapPage.SEND]: (
    <FullScreenWithConnectedDevice>
      <SwapSend />
    </FullScreenWithConnectedDevice>
  ),
  [SwapPage.STATUS]: <SwapStatus />,
};

export const Swap = () => {
  const { currentPage } = useSwap();

  const currentComponent = useMemo(() => pageMap[currentPage], [currentPage]);

  return (
    <MainAppLayout topbar={{ title: 'Swap' }}>{currentComponent}</MainAppLayout>
  );
};
