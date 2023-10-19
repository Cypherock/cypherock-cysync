import { BtcIdMap, coinList } from '@cypherock/coins';
import { Container, DisplayGraph } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { AssetAllocation, TransactionTable } from '~/components';

import { usePortfolioPage } from '../hooks';

const PortfolioPageContent: FC = () => {
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
    formatTimestamp,
    formatYAxisTick,
    summaryDetails,
    onAssetClick,
  } = usePortfolioPage();

  return (
    <>
      <Container $noFlex mb={2}>
        <DisplayGraph
          title={summaryDetails.totalValue}
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
          formatTimestamp={formatTimestamp}
          formatYAxisTick={formatYAxisTick}
          color={coinList[BtcIdMap.bitcoin].color ?? ''}
        />
      </Container>

      <Container $noFlex mb={2}>
        <AssetAllocation
          walletId={selectedWallet?.__id}
          onRowClick={onAssetClick}
        />
      </Container>

      <Container $noFlex mb={2}>
        <TransactionTable limit={10} walletId={selectedWallet?.__id} />
      </Container>
    </>
  );
};

export default PortfolioPageContent;
