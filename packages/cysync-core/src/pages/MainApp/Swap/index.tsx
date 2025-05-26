import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';

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
import { SwapHistory } from './components/SwapHistory';

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
}> = ({ children, onBack }) => {
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
        {/* {onHistory && (
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
        )} */}
      </Flex>
      <div style={{ alignItems: 'stretch', height: '91%', width: '100%' }}>
        {children}
      </div>
    </Container>
  );
};

ComponentWithHeader.defaultProps = {
  onBack: undefined,
};

const SwapDetailsComponent: React.FC = () => (
  <ComponentWithHeader>
    <SwapDetailsInput />
  </ComponentWithHeader>
);

const SwapSummaryComponent: React.FC<{
  toPreviousPage?: () => void;
}> = ({ toPreviousPage }) => (
  <ComponentWithHeader onBack={toPreviousPage}>
    <SwapSummary />
  </ComponentWithHeader>
);

SwapSummaryComponent.defaultProps = {
  toPreviousPage: undefined,
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
  [SwapPage.DETAILS]: () => <SwapDetailsComponent />,
  [SwapPage.SUMMARY]: params => <SwapSummaryComponent {...params} />,
  [SwapPage.RECEIVE]: params => <SwapReceiveComponent {...params} />,
  [SwapPage.SEND]: params => <SwapSendComponent {...params} />,
  [SwapPage.STATUS]: () => <SwapStatus />,
};

export const Swap = () => {
  const { currentPage, error, retryCurrentPage, toPreviousPage, reset } =
    useSwap();
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

  // @todo: disable history if there are no previous swap transactions
  const disableHistory = true;
  const handleHistoryClick = () => setShowHistory(true);

  return (
    <MainAppLayout
      topbar={{ title: strings.swap.title }}
      onTopbarHeightChange={setTopbarHeight}
    >
      {showHistory ? (
        <ComponentWithHeader onBack={() => setShowHistory(false)}>
          <SwapHistory topbarHeight={topbarHeight} />
        </ComponentWithHeader>
      ) : (
        currentComponent({
          onHistory: handleHistoryClick,
          onClose: reset,
          toPreviousPage,
          disableHistory,
        })
      )}
    </MainAppLayout>
  );
};
