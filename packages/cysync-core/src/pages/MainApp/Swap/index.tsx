import React, { useMemo } from 'react';

import { SwapPage, useSwap } from '~/context';

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
import { selectLanguage, useAppSelector } from '~/store';

const FullScreenWithConnectedDevice: React.FC<{
  children: React.ReactNode;
  onClose?: () => void;
  onHistory: () => void;
}> = ({ children, onClose, onHistory }) => (
  <ComponentWithHeader onBack={onClose} onHistory={onHistory}>
    <Container width="full" height="full">
      <WithConnectedDevice>{children}</WithConnectedDevice>;
    </Container>
  </ComponentWithHeader>
);

FullScreenWithConnectedDevice.defaultProps = {
  onClose: undefined,
};

const ComponentWithHeader: React.FC<{
  children: React.ReactNode;
  onBack?: () => void;
  onHistory: () => void;
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
        <Button variant="text" title="History" onClick={onHistory}>
          <Typography variant="p" color="white">
            {lang.strings.sidebar.history}
          </Typography>
        </Button>
      </Flex>
      <div style={{ alignItems: 'stretch', height: '90%', width: '100%' }}>
        {children}
      </div>
    </Container>
  );
};

ComponentWithHeader.defaultProps = {
  onBack: undefined,
};

const pageMap: Record<
  SwapPage,
  (onHistory: () => void, toPreviousPage?: () => void) => React.ReactNode
> = {
  [SwapPage.DETAILS]: onHistory => (
    <ComponentWithHeader onHistory={onHistory}>
      <SwapDetailsInput />
    </ComponentWithHeader>
  ),
  [SwapPage.SUMMARY]: (onHistory, toPreviousPage) => (
    <ComponentWithHeader onHistory={onHistory} onBack={toPreviousPage}>
      <SwapSummary />
    </ComponentWithHeader>
  ),
  [SwapPage.RECEIVE]: (onHistory, toPreviousPage) => (
    <FullScreenWithConnectedDevice
      onClose={toPreviousPage}
      onHistory={onHistory}
    >
      <SwapReceive />
    </FullScreenWithConnectedDevice>
  ),
  [SwapPage.SEND]: (onHistory, toPreviousPage) => (
    <FullScreenWithConnectedDevice
      onClose={toPreviousPage}
      onHistory={onHistory}
    >
      <SwapSend />
    </FullScreenWithConnectedDevice>
  ),
  [SwapPage.STATUS]: () => <SwapStatus />,
};

export const Swap = () => {
  const { currentPage, toPreviousPage } = useSwap();

  const currentComponent = useMemo(() => pageMap[currentPage], [currentPage]);
  const handleHistoryClick = () => console.log('should open history!');

  return (
    <MainAppLayout topbar={{ title: 'Swap' }}>
      {currentComponent(handleHistoryClick, toPreviousPage)}
    </MainAppLayout>
  );
};
