import {
  AssetAllocationTableHeader,
  TableStructure,
  AssetAllocationTableHeaderName,
  TableTitle,
  Typography,
  LangDisplay,
  AssetAllocationTableRow,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useMemo, useState } from 'react';

import { useAppSelector } from '~/store';
import { selectLanguage } from '~/store/lang';

import { CoinAllocationRow } from '../hooks';

export interface AssetAllocationProps {
  coinAllocations: CoinAllocationRow[];
  onAssetClick: (assetId: string) => void;
}

const comparatorMap: Record<AssetAllocationTableHeaderName, string> = {
  allocation: 'allocation',
  price: 'price',
  balance: 'balance',
  value: 'value',
  asset: 'assetAbbr',
};

export const AssetAllocation: React.FC<AssetAllocationProps> = ({
  coinAllocations,
  onAssetClick,
}) => {
  const lang = useAppSelector(selectLanguage);
  const [sortedBy, setSortedBy] =
    React.useState<AssetAllocationTableHeaderName>('allocation');
  const [isAscending, setIsAscending] = useState(false);

  const onSort = (columnName: AssetAllocationTableHeaderName) => {
    if (sortedBy === columnName) {
      setIsAscending(!isAscending);
      return;
    }
    setSortedBy(columnName);
    setIsAscending(true);
  };

  const displayRows = useMemo(
    () =>
      lodash.orderBy(
        coinAllocations,
        comparatorMap[sortedBy],
        isAscending ? 'asc' : 'desc',
      ),
    [coinAllocations, sortedBy, isAscending],
  );

  if (displayRows.length <= 0) {
    return null;
  }

  return (
    <TableStructure $noMargin>
      <TableTitle width="full">
        <Typography variant="h5" color="muted">
          <LangDisplay text={lang.strings.portfolio.assetAllocation.title} />
        </Typography>
      </TableTitle>
      <AssetAllocationTableHeader
        asset={lang.strings.portfolio.assetAllocation.tableHeader.asset}
        price={lang.strings.portfolio.assetAllocation.tableHeader.price}
        balance={lang.strings.portfolio.assetAllocation.tableHeader.balance}
        value={lang.strings.portfolio.assetAllocation.tableHeader.value}
        allocation={
          lang.strings.portfolio.assetAllocation.tableHeader.allocation
        }
        $ascending={isAscending}
        selected={sortedBy}
        onSort={onSort}
      />
      {displayRows.map((row, index) => (
        <AssetAllocationTableRow
          key={row.assetId}
          assetAbbr={row.assetAbbr}
          assetName={row.assetName}
          assetIcon={row.assetIcon}
          price={row.displayPrice}
          balance={row.displayBalance}
          allocation={row.allocation}
          value={row.displayValue}
          $isLast={index === displayRows.length - 1}
          $rowIndex={index}
          onClick={() => onAssetClick(row.assetId)}
        />
      ))}
    </TableStructure>
  );
};
