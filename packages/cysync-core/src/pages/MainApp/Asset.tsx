import { BtcIdMap, coinList } from '@cypherock/coins';
import { Container, DisplayGraph } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { AssetAllocation, TransactionTable } from '~/components';

import { useAssetPage } from './hooks';
import { MainAppLayout } from './Layout';

export const AssetPage: FC = () => {
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
    selectedAsset,
    assetId,
    parentAssetId,
    onGraphSwitch,
  } = useAssetPage();

  return (
    <MainAppLayout title={selectedAsset?.name ?? ''}>
      <Container $noFlex m="20">
        <Container $noFlex mb={2}>
          <DisplayGraph
            title={summaryDetails.totalBalance}
            subTitle={summaryDetails.totalValue}
            conversionRate={summaryDetails.conversionRate}
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
            color={selectedAsset?.color ?? coinList[BtcIdMap.bitcoin].color}
            onSwitch={onGraphSwitch}
          />
        </Container>

        <Container $noFlex mb={2}>
          <AssetAllocation
            assetId={assetId}
            parentAssetId={parentAssetId}
            walletId={
              selectedWallet?.__id !== 'all' ? selectedWallet?.__id : undefined
            }
            onAssetClick={onAssetClick}
          />
        </Container>

        <Container $noFlex mb={2}>
          <TransactionTable
            limit={10}
            walletId={
              selectedWallet?.__id !== 'all' ? selectedWallet?.__id : undefined
            }
            assetId={assetId}
            parentAssetId={parentAssetId}
          />
        </Container>
      </Container>
    </MainAppLayout>
  );
};
