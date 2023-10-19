import { coinList, BtcIdMap } from '@cypherock/coins';
import { DisplayGraph, DropDownListItemProps } from '@cypherock/cysync-ui';
import { IWallet } from '@cypherock/db-interfaces';
import React from 'react';

import { useGraph } from '~/hooks';

export interface PortfolioGraphProps {
  selectedWallet?: IWallet;
  handleWalletChange: (walletId?: string) => void;
  walletDropdownList: DropDownListItemProps[];
}

export const PortfolioGraph: React.FC<PortfolioGraphProps> = ({
  selectedWallet,
  handleWalletChange,
  walletDropdownList,
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
  } = useGraph({ selectedWallet });

  return (
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
  );
};

PortfolioGraph.defaultProps = {
  selectedWallet: undefined,
};

export default PortfolioGraph;
