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
  disableHistory?: boolean;
}> = ({ children, onBack, onHistory, disableHistory }) => {
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
          <Button
            variant="text"
            title="History"
            onClick={onHistory}
            disabled={disableHistory}
          >
            <Typography
              variant="p"
              color={disableHistory ? 'disabled' : 'white'}
            >
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
  disableHistory: undefined,
};

const SwapDetailsComponent: React.FC<{
  onHistory: () => void;
  disableHistory?: boolean;
}> = ({ onHistory, disableHistory }) => (
  <ComponentWithHeader onHistory={onHistory} disableHistory={disableHistory}>
    <SwapDetailsInput />
  </ComponentWithHeader>
);

SwapDetailsComponent.defaultProps = {
  disableHistory: undefined,
};

const SwapSummaryComponent: React.FC<{
  onHistory: () => void;
  toPreviousPage?: () => void;
  disableHistory?: boolean;
}> = ({ onHistory, toPreviousPage, disableHistory }) => (
  <ComponentWithHeader
    onHistory={onHistory}
    onBack={toPreviousPage}
    disableHistory={disableHistory}
  >
    <SwapSummary />
  </ComponentWithHeader>
);

SwapSummaryComponent.defaultProps = {
  toPreviousPage: undefined,
  disableHistory: undefined,
};

const SwapReceiveComponent: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => (
  <FullScreenWithConnectedDevice onClose={onClose}>
    <SwapReceive />
  </FullScreenWithConnectedDevice>
);

const SwapSendComponent: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <FullScreenWithConnectedDevice onClose={onClose}>
    <SwapSend />
  </FullScreenWithConnectedDevice>
);

const pageMap: Record<
  SwapPage,
  (params: {
    onHistory: () => void;
    onClose: () => void;
    toPreviousPage?: () => void;
    disableHistory?: boolean;
  }) => React.ReactNode
> = {
  [SwapPage.DETAILS]: params => <SwapDetailsComponent {...params} />,
  [SwapPage.SUMMARY]: params => <SwapSummaryComponent {...params} />,
  [SwapPage.RECEIVE]: params => <SwapReceiveComponent {...params} />,
  [SwapPage.SEND]: params => <SwapSendComponent {...params} />,
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

  // TODO: disable history if there are no previous swap transactions
  const disableHistory = true;
  const handleHistoryClick = () => console.log('should open history!');

  return (
    <MainAppLayout topbar={{ title: 'Swap' }}>
      {currentComponent({
        onHistory: handleHistoryClick,
        onClose: reset,
        toPreviousPage,
        disableHistory,
      })}
    </MainAppLayout>
  );
};
