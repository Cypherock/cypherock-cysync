import {
  NoAccountWrapper,
  SkeletonLoader,
  GraphGreyIcon,
  Container,
  DisplayGraph,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { MainAppLayout, TransactionTable } from '~/pages/MainApp/Components';

import { AssetAllocation } from './AssetAllocation';
import { NoWallet } from './NoWallet';

import { usePortfolioPage } from '../hooks';

export const Portfolio: FC = () => {
  const {
    lang,
    handleWalletChange,
    selectedWallet,
    walletDropdownList,
    rangeList,
    selectedRange,
    setSelectedRange,
    graphData,
    formatTooltipValue,
    summaryDetails,
    wallets,
    accounts,
    handleAddAccountClick,
    coinAllocations,
    onAssetClick,
  } = usePortfolioPage();

  /*
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(openWalletActionsDialog());
  }, []);
   */

  const getMainContent = () => {
    if (wallets.length <= 0) {
      return <NoWallet />;
    }

    if (accounts.length <= 0) {
      return (
        <NoAccountWrapper>
          <SkeletonLoader
            loader={<GraphGreyIcon />}
            text={lang.strings.portfolio.accountMissing.text}
            subText={lang.strings.portfolio.accountMissing.subText}
            $buttonOne={lang.strings.buttons.addAccount}
            onClick={handleAddAccountClick}
            $noLoaderContainer
          />
        </NoAccountWrapper>
      );
    }

    return (
      <>
        <Container $noFlex mb={2}>
          <DisplayGraph
            title={summaryDetails.totalBalance}
            subTitle={lang.strings.graph.totalBalance}
            dropdownItems={walletDropdownList}
            selectedDropdownItem={selectedWallet?.__id ?? 'all'}
            onDropdownChange={handleWalletChange}
            dropdownSearchText={lang.strings.graph.walletDropdown.search}
            pillButtonList={rangeList}
            selectedPill={selectedRange}
            onPillButtonChange={setSelectedRange as any}
            summaryText={summaryDetails.changePercent}
            summarySubText={summaryDetails.changeValue}
            summaryIcon={summaryDetails.changeIcon}
            data={graphData}
            formatTooltipValue={formatTooltipValue}
          />
        </Container>

        <Container $noFlex mb={2}>
          <AssetAllocation
            coinAllocations={coinAllocations}
            onAssetClick={onAssetClick}
          />
        </Container>

        <Container $noFlex mb={2}>
          <TransactionTable
            limit={10}
            walletId={
              selectedWallet?.__id !== 'all' ? selectedWallet?.__id : undefined
            }
          />
        </Container>
      </>
    );
  };

  return (
    <MainAppLayout title={lang.strings.portfolio.title}>
      <Container $noFlex m="20">
        {getMainContent()}
      </Container>
    </MainAppLayout>
  );
};
