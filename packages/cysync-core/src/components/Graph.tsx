import { coinList, BtcIdMap } from '@cypherock/coins';
import { DisplayGraph, DropDownItemProps } from '@cypherock/cysync-ui';
import React from 'react';

import { useGraph, UseGraphProps } from '~/hooks';

export interface GraphProps extends UseGraphProps {
  color?: string;
  handleWalletChange: (walletId?: string) => void;
  walletDropdownList: DropDownItemProps[];
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
    formatGraphAmountDisplay,
  } = useGraph({ selectedWallet, accountId, assetId, parentAssetId });

  return (
    <DisplayGraph
      title={formatGraphAmountDisplay(
        showGraphInUSD
          ? summaryDetails.totalValue
          : summaryDetails.totalBalance,
        undefined,
        true,
      )}
      subTitle={formatGraphAmountDisplay(
        showGraphInUSD
          ? summaryDetails.totalBalance
          : summaryDetails.totalValue,
        !showGraphInUSD,
        true,
      )}
      conversionRate={summaryDetails.conversionRate}
      dropdownItems={walletDropdownList}
      selectedDropdownItem={selectedWallet?.__id ?? 'all'}
      onDropdownChange={handleWalletChange}
      dropdownSearchText={lang.strings.graph.walletDropdown.search}
      pillButtonList={rangeList}
      selectedPill={selectedRange}
      onPillButtonChange={setSelectedRange as any}
      summaryText={summaryDetails.changePercent}
      summarySubText={formatGraphAmountDisplay(
        summaryDetails.changeValue,
        undefined,
        true,
      )}
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
