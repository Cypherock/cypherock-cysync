import React, { memo, useMemo, useState } from 'react';
import { CoinAllocationRow, AllocationTableHeaderKeys } from '@/hooks';
import {
  Table,
  TableHeader,
  TableHeaderData,
  TableBody,
  TableRowData,
  XTableCell,
  Typography,
  Seperator,
} from '../ui';
import { colors } from '../ui/themes/color.styled';
import { useSubAccounts } from '@/hooks/useSubAccounts';
import { selectLanguage, useAppSelector } from '@/store';
import lodash from 'lodash';

export interface TokenTableProps {
  accountId?: string;
  onItemClick?: (item: CoinAllocationRow) => void;
  noData?: boolean;
}

const comparatorMap: Record<AllocationTableHeaderKeys, string> = {
  amount: 'amount',
  asset: 'assetName',
};

function TokenTable(props: TokenTableProps) {
  const { subAccounts } = useSubAccounts(props);
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings;

  const [sortedBy, setSortedBy] =
    React.useState<AllocationTableHeaderKeys>('amount');
  const [isAscending, setIsAscending] = useState(false);

  const onSort = (columnName: AllocationTableHeaderKeys) => {
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
        subAccounts,
        comparatorMap[sortedBy],
        isAscending ? 'asc' : 'desc',
      ),
    [subAccounts, sortedBy, isAscending],
  );

  const rowRenderer = ({ index }: any) => {
    const row = displayRows[index];

    return (
      <TableRowData index={index} onPress={() => {}}>
        <XTableCell
          leftIcon={row.assetIcon}
          primaryText={row.assetName}
          secondaryText={row.assetAbbr}
        />
        <XTableCell
          primaryTextAlign="right"
          primaryText={row.displayAmount}
          secondaryTextAlign="right"
          secondaryText={row.displayValue}
          justifyContent="flex-end"
        />
      </TableRowData>
    );
  };

  return (
    <Table>
      <TableHeader style={{ backgroundColor: colors.background.input }}>
        {Object.keys(strings.portfolio.dashboard.table).map(v => (
          <TableHeaderData
            key={v}
            data={
              strings.portfolio.dashboard.table[v as AllocationTableHeaderKeys]
            }
            selected={sortedBy === v}
            ascending={isAscending}
            onPress={() => onSort(v as AllocationTableHeaderKeys)}
          />
        ))}
      </TableHeader>
      {props.noData ? (
        <Typography type="h5" color="secondary" style={{ paddingVertical: 24 }}>
          No tokens!!
        </Typography>
      ) : (
        <TableBody
          data={subAccounts}
          renderItem={rowRenderer}
          separator={() => (
            <Seperator style={{ backgroundColor: colors.black }} />
          )}
        />
      )}
    </Table>
  );
}

export default memo(TokenTable);
