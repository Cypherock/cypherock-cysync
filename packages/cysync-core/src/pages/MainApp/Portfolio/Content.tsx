import { Container, DisplayGraphSkeleton } from '@cypherock/cysync-ui';
import React, { FC, lazy, Suspense } from 'react';

import { Graph } from '~/components';

import { usePortfolioPage } from '../hooks';

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
          <Graph
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
            withParentIconAtBottom
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
