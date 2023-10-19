import { Container, DisplayGraphSkeleton } from '@cypherock/cysync-ui';
import React, { FC, lazy, Suspense } from 'react';

import { usePortfolioPage } from '../hooks';

const PortfolioGraph = lazy(() => import('./Graph'));
const AssetAllocation = lazy(() => import('~/components/AssetAllocation'));
const TransactionTable = lazy(() => import('~/components/TransactionTable'));

const PortfolioPageContent: FC = () => {
  const {
    selectedWallet,
    onAssetClick,
    handleWalletChange,
    walletDropdownList,
  } = usePortfolioPage();

  return (
    <>
      <Suspense fallback={<DisplayGraphSkeleton />}>
        <Container $noFlex mb={2}>
          <PortfolioGraph
            selectedWallet={selectedWallet}
            handleWalletChange={handleWalletChange}
            walletDropdownList={walletDropdownList}
          />
        </Container>
      </Suspense>

      <Suspense>
        <Container $noFlex mb={2}>
          <AssetAllocation
            walletId={selectedWallet?.__id}
            onRowClick={onAssetClick}
          />
        </Container>
      </Suspense>

      <Suspense>
        <Container $noFlex mb={2}>
          <TransactionTable limit={10} walletId={selectedWallet?.__id} />
        </Container>
      </Suspense>
    </>
  );
};

export default PortfolioPageContent;
