import React, { useEffect, useLayoutEffect, useMemo } from 'react';

import { openErrorDialog } from '~/actions';
import { SwapPage, useSwap } from '~/context';
import {
  closeDialog,
  useAppDispatch,
  selectLanguage,
  useAppSelector,
} from '~/store';

import { SwapDetailsInput } from './Pages/SwapDetailsInput';
import { SwapReceive } from './Pages/SwapReceive';
import { SwapSend } from './Pages/SwapSend';
import { SwapStatus } from './Pages/SwapStatus';
import { SwapSummary } from './Pages/SwapSummary';

import { MainAppLayout } from '../Layout';
import { WithConnectedDevice } from '~/components';
import {
  ArrowBackGoldenIcon,
  Button,
  Container,
  Flex,
  Typography,
} from '@cypherock/cysync-ui';

const FullScreenWithConnectedDevice: React.FC<{
  children: React.ReactNode;
  onClose?: () => void;
}> = ({ children, onClose }) => (
  <Container width="full" height="full">
    <WithConnectedDevice onClose={onClose}>{children}</WithConnectedDevice>;
  </Container>
);

FullScreenWithConnectedDevice.defaultProps = {
  onClose: undefined,
};

const ComponentWithHeader: React.FC<{
  children: React.ReactNode;
  onBack?: () => void;
  onHistory?: () => void;
}> = ({ children, onBack, onHistory }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <Container
      direction="column"
      width="full"
      height="full"
      justify="flex-start"
      my={2}
    >
      <Flex
        $alignSelf="stretch"
        justify={onBack ? 'space-between' : 'flex-end'}
        px="40px"
        py="10px"
        align="center"
        $bgColor="sideBar"
      >
        {onBack && (
          <Button
            variant="text"
            iconComponent={ArrowBackGoldenIcon}
            title="Back"
            onClick={onBack}
          >
            <Typography variant="p" color="white">
              {lang.strings.buttons.back}
            </Typography>
          </Button>
        )}
        {onHistory && (
          <Button variant="text" title="History" onClick={onHistory}>
            <Typography variant="p" color="white">
              {lang.strings.sidebar.history}
            </Typography>
          </Button>
        )}
      </Flex>
      <div style={{ alignItems: 'stretch', height: '90%', width: '100%' }}>
        {children}
      </div>
    </Container>
  );
};

ComponentWithHeader.defaultProps = {
  onBack: undefined,
  onHistory: undefined,
};

const pageMap: Record<
  SwapPage,
  (
    onHistory: () => void,
    onClose: () => void,
    toPreviousPage?: () => void,
  ) => React.ReactNode
> = {
  [SwapPage.DETAILS]: onHistory => (
    <ComponentWithHeader onHistory={onHistory}>
      <SwapDetailsInput />
    </ComponentWithHeader>
  ),
  [SwapPage.SUMMARY]: (onHistory, _, toPreviousPage) => (
    <ComponentWithHeader onHistory={onHistory} onBack={toPreviousPage}>
      <SwapSummary />
    </ComponentWithHeader>
  ),
  [SwapPage.RECEIVE]: (_, onClose) => (
    <FullScreenWithConnectedDevice onClose={onClose}>
      <SwapReceive />
    </FullScreenWithConnectedDevice>
  ),
  [SwapPage.SEND]: (_, onClose) => (
    <FullScreenWithConnectedDevice onClose={onClose}>
      <SwapSend />
    </FullScreenWithConnectedDevice>
  ),
  [SwapPage.STATUS]: () => <SwapStatus />,
};

export const Swap = () => {
  const { currentPage, error, retryCurrentPage, toPreviousPage, reset } =
    useSwap();
  const dispatch = useAppDispatch();

  const currentComponent = useMemo(() => pageMap[currentPage], [currentPage]);

  useEffect(() => reset, []);

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
          onClose: reset,
        }),
      );
    }
  }, [error]);
  const handleHistoryClick = () => console.log('should open history!');

  return (
    <MainAppLayout topbar={{ title: 'Swap' }}>
      {currentComponent(handleHistoryClick, reset, toPreviousPage)}
    </MainAppLayout>
  );
};
