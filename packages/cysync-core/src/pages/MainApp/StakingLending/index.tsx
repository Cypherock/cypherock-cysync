import { Container, Flex, Button, Typography } from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import React, { useCallback, useState } from 'react';

import { ErrorHandlerDialog, LoaderDialog } from '~/components';
import { useAppSelector, selectWallets } from '~/store';
import logger from '~/utils/logger';

import { MainAppLayout } from '../Layout';
import { WidgetAccountSelector } from './components/WidgetAccountSelector';
import { WidgetContainer } from './components/WidgetContainer';

enum StakingLendingState {
  OVERVIEW = 'overview',
  ACCOUNT_SELECTION = 'account_selection',
  WIDGET_ACTIVE = 'widget_active',
  ERROR = 'error',
}

export const StakingLending = () => {
  const { wallets } = useAppSelector(selectWallets);
  const [currentState, setCurrentState] = useState<StakingLendingState>(
    StakingLendingState.OVERVIEW,
  );
  const [selectedAccount, setSelectedAccount] = useState<
    IAccount | undefined
  >();
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Handle account selection from dialog
  const handleAccountSelected = async (account: IAccount, wallet: IWallet) => {
    logger.info('StakingLending: Account selected', {
      wallet: wallet.name,
      account: account.name,
    });

    console.log('DEBUG: Account selected, going directly to widget', {
      account: account.name,
      wallet: wallet.name,
    });

    // Set selected account/wallet
    setSelectedAccount(account);
    setCurrentState(StakingLendingState.WIDGET_ACTIVE);

    // Clear any previous errors
    setGeneralError(null);
  };

  // Handle going back to overview
  const handleBackToOverview = () => {
    logger.info('StakingLending: Returning to overview');
    setSelectedAccount(undefined);
    setGeneralError(null);
    setCurrentState(StakingLendingState.OVERVIEW);
  };

  // Handle widget errors
  const handleWidgetError = (error: string) => {
    logger.error('StakingLending: Widget error', new Error(error));
    setGeneralError(error);
    setCurrentState(StakingLendingState.ERROR);
  };

  // Handle retry from error state
  const handleRetry = () => {
    setGeneralError(null);
    setCurrentState(StakingLendingState.OVERVIEW);
  };

  // Overview screen - starting point
  const OverviewScreen = useCallback(
    () => (
      <Container width="full" height="full" py={6} px={5}>
        <Flex
          direction="column"
          gap={32}
          align="center"
          justify="center"
          height="full"
        >
          <Container direction="column" gap={16} align="center">
            <Typography variant="h4" $textAlign="center">
              Staking & Lending
            </Typography>
          </Container>

          <Container direction="column" gap={16} align="center">
            <Button
              variant="primary"
              disabled={wallets.length === 0}
              onClick={() =>
                setCurrentState(StakingLendingState.ACCOUNT_SELECTION)
              }
            >
              Start Staking & Lending
            </Button>

            {wallets.length === 0 && (
              <Typography color="error" $fontSize={14} $textAlign="center">
                Please connect a wallet to continue
              </Typography>
            )}
          </Container>
        </Flex>
      </Container>
    ),
    [wallets],
  );

  // Account selection screen
  const AccountSelectionScreen = useCallback(
    () => (
      <WidgetAccountSelector
        onAccountSelected={handleAccountSelected}
        onClose={handleBackToOverview}
        isConnecting={false}
      />
    ),
    [handleAccountSelected, handleBackToOverview],
  );

  // Active widget screen
  const WidgetScreen = useCallback(() => {
    if (!selectedAccount) {
      return <LoaderDialog />;
    }

    return (
      <WidgetContainer
        selectedAccount={selectedAccount}
        onError={handleWidgetError}
        onDisconnect={handleBackToOverview}
      />
    );
  }, [selectedAccount, handleWidgetError, handleBackToOverview]);

  // Error screen
  const ErrorScreen = useCallback(
    () => (
      <Container width="full" height="full" py={6} px={5}>
        <Flex
          direction="column"
          gap={24}
          align="center"
          justify="center"
          height="full"
        >
          <Typography variant="h5" color="error" $textAlign="center">
            Connection Error
          </Typography>

          <Typography color="muted" $textAlign="center" $maxWidth="400px">
            {generalError ?? 'An unexpected error occurred'}
          </Typography>

          <Flex gap={16}>
            <Button variant="secondary" onClick={handleBackToOverview}>
              Back to Overview
            </Button>
            <Button variant="primary" onClick={handleRetry}>
              Try Again
            </Button>
          </Flex>
        </Flex>
      </Container>
    ),
    [generalError, handleBackToOverview, handleRetry],
  );

  // Render based on current state
  const renderContent = () => {
    switch (currentState) {
      case StakingLendingState.OVERVIEW:
        return <OverviewScreen />;

      case StakingLendingState.ACCOUNT_SELECTION:
        return <AccountSelectionScreen />;

      case StakingLendingState.WIDGET_ACTIVE:
        return <WidgetScreen />;

      case StakingLendingState.ERROR:
        return <ErrorScreen />;

      default:
        return <OverviewScreen />;
    }
  };

  return (
    <MainAppLayout topbar={{ title: 'Staking & Lending' }}>
      <Container width="full" height="full">
        <ErrorHandlerDialog
          error={generalError ? new Error(generalError) : undefined}
          onClose={() => setGeneralError(null)}
          onRetry={handleRetry}
        >
          {renderContent()}
        </ErrorHandlerDialog>
      </Container>
    </MainAppLayout>
  );
};
