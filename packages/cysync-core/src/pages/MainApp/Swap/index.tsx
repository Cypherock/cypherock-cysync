import {
  ArrowBackGoldenIcon,
  Button,
  Container,
  Flex,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';

import { openErrorDialog } from '~/actions';
import { WithConnectedDevice } from '~/components';
import { SwapPage, useSwap } from '~/context';
import { useSwapTransactions } from '~/hooks';
import {
  closeDialog,
  useAppDispatch,
  selectLanguage,
  useAppSelector,
} from '~/store';

import { SwapHistory } from './components/SwapHistory';
import { SwapDetailsInput } from './Pages/SwapDetailsInput';
import { SwapReceive } from './Pages/SwapReceive';
import { SwapSend } from './Pages/SwapSend';
import { SwapStatus } from './Pages/SwapStatus';
import { SwapSummary } from './Pages/SwapSummary';

import { MainAppLayout } from '../Layout';

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
      <div style={{ alignItems: 'stretch', height: '91%', width: '100%' }}>
        {children}
      </div>
    </Container>
  );
};

ComponentWithHeader.defaultProps = {
  onBack: undefined,
  onHistory: undefined,
  disableHistory: false,
};

const SwapDetailsComponent: React.FC<{
  onHistory?: () => void;
  disableHistory?: boolean;
}> = ({ onHistory, disableHistory }) => (
  <ComponentWithHeader onHistory={onHistory} disableHistory={disableHistory}>
    <SwapDetailsInput />
  </ComponentWithHeader>
);

SwapDetailsComponent.defaultProps = {
  onHistory: undefined,
  disableHistory: false,
};

const SwapSummaryComponent: React.FC<{
  toPreviousPage?: () => void;
  onHistory?: () => void;
  disableHistory?: boolean;
}> = ({ toPreviousPage, onHistory, disableHistory }) => (
  <ComponentWithHeader
    onBack={toPreviousPage}
    onHistory={onHistory}
    disableHistory={disableHistory}
  >
    <SwapSummary />
  </ComponentWithHeader>
);

SwapSummaryComponent.defaultProps = {
  toPreviousPage: undefined,
  onHistory: undefined,
  disableHistory: false,
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
  const { displayedData } = useSwapTransactions();
  const [showHistory, setShowHistory] = useState(false);
  const [topbarHeight, setTopbarHeight] = useState(0);
  const dispatch = useAppDispatch();
  const { strings } = useAppSelector(selectLanguage);

  const currentComponent = useMemo(() => pageMap[currentPage], [currentPage]);

  useEffect(() => () => reset(), []);

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

  const handleHistoryClick = () => {
    if (displayedData.length > 0) {
      setShowHistory(true);
    }
  };

  const onHistoryBack = () => {
    retryCurrentPage();
    setShowHistory(false);
  };

  return (
    <MainAppLayout
      topbar={{ title: strings.swap.title }}
      onTopbarHeightChange={setTopbarHeight}
    >
      {showHistory ? (
        <ComponentWithHeader onBack={onHistoryBack}>
          <SwapHistory topbarHeight={topbarHeight} />
        </ComponentWithHeader>
      ) : (
        currentComponent({
          onHistory: handleHistoryClick,
          disableHistory: displayedData.length === 0,
          onClose: reset,
          toPreviousPage,
        })
      )}
    </MainAppLayout>
  );
};
