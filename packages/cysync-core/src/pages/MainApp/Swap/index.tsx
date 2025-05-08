import { Container } from '@cypherock/cysync-ui';
import React, { useLayoutEffect, useMemo } from 'react';

import { openErrorDialog } from '~/actions';
import { WithConnectedDevice } from '~/components';
import { SwapPage, useSwap } from '~/context';
import { closeDialog, useAppDispatch } from '~/store';

import { SwapDetailsInput } from './Pages/SwapDetailsInput';
import { SwapReceive } from './Pages/SwapReceive';
import { SwapSend } from './Pages/SwapSend';
import { SwapStatus } from './Pages/SwapStatus';
import { SwapSummary } from './Pages/SwapSummary';

import { MainAppLayout } from '../Layout';

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
  const { currentPage, error, retryCurrentPage } = useSwap();
  const dispatch = useAppDispatch();

  const currentComponent = useMemo(() => pageMap[currentPage], [currentPage]);

  useLayoutEffect(() => {
    if (error) {
      dispatch(
        openErrorDialog({
          error,
          showCloseButton: true,
          suppressActions: false,
          onRetry: () => {
            retryCurrentPage();
            dispatch(closeDialog('errorDialog'));
          },
        }),
      );
    }
  }, [error]);

  return (
    <MainAppLayout topbar={{ title: 'Swap' }}>{currentComponent}</MainAppLayout>
  );
};
