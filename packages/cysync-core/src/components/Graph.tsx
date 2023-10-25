import { coinList, BtcIdMap } from '@cypherock/coins';
import { DisplayGraph, DropDownListItemProps } from '@cypherock/cysync-ui';
import React from 'react';

import { useGraph, UseGraphProps } from '~/hooks';

export interface GraphProps extends UseGraphProps {
  color?: string;
  handleWalletChange: (walletId?: string) => void;
  walletDropdownList: DropDownListItemProps[];
}

export const Graph: React.FC<GraphProps> = ({
  selectedWallet,
  handleWalletChange,
  walletDropdownList,
  accountId,
  assetId,
  parentAssetId,
  color,
}) => {
  const {
    lang,
    rangeList,
    selectedRange,
    setSelectedRange,
    graphData,
    formatTooltipValue,
    formatTimestamp,
    formatYAxisTick,
    summaryDetails,
    isLoading,
    showGraphInUSD,
    onGraphSwitch,
  } = useGraph({ selectedWallet, accountId, assetId, parentAssetId });

  return (
    <DisplayGraph
      title={
        showGraphInUSD ? summaryDetails.totalValue : summaryDetails.totalBalance
      }
      subTitle={
        showGraphInUSD ? summaryDetails.totalBalance : summaryDetails.totalValue
      }
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
      color={color ?? coinList[BtcIdMap.bitcoin].color ?? ''}
      onSwitch={
        assetId || parentAssetId || accountId ? onGraphSwitch : undefined
      }
      isLoading={isLoading}
    />
  );
};

Graph.defaultProps = {
  color: undefined,
};

export default Graph;
