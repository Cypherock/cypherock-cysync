import {
  Button,
  AssetAllocationTableHeader,
  TableStructure,
  AssetAllocationTableHeaderName,
  TableTitle,
  Typography,
  LangDisplay,
  AssetAllocationTableRow,
  Container,
  CssClassNames,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useMemo, useState } from 'react';
import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';

import { openAddAccountDialog } from '~/actions';
import { CoinAllocationRow, useAssetAllocations } from '~/hooks';

export interface AssetAllocationProps {
  walletId?: string;
  parentAssetId?: string;
  assetId?: string;
  accountId?: string;
  onRowClick: (row: CoinAllocationRow) => void;
  withSubIconAtBottom?: boolean;
  withParentIconAtBottom?: boolean;
}

const comparatorMap: Record<AssetAllocationTableHeaderName, string> = {
  allocation: 'allocation',
  account: 'accountName',
  wallet: 'walletName',
  price: 'price',
  balance: 'balance',
  value: 'value',
  asset: 'assetAbbr',
};

const ROW_HEIGHT = 82;
const MAX_ROWS_DISPLAYED = 5;

export const AssetAllocation: React.FC<AssetAllocationProps> = ({
  walletId,
  assetId,
  parentAssetId,
  accountId,
  onRowClick,
  withSubIconAtBottom,
  withParentIconAtBottom,
}) => {
  const { coinAllocations, strings, dispatch, isAccountDisplay } =
    useAssetAllocations({
      walletId,
      parentAssetId,
      assetId,
      accountId,
      withSubIconAtBottom,
      withParentIconAtBottom,
    });
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

  const rowRenderer = ({ key, index, style }: any) => {
    const row = displayRows[index];

    return (
      <AssetAllocationTableRow
        style={style}
        key={key}
        color={row.color}
        assetAbbr={row.assetAbbr}
        assetName={row.assetName}
        assetIcon={row.assetIcon}
        accountName={row.accountName}
        accountTag={row.accountTag}
        walletName={row.walletName}
        price={row.displayPrice}
        balance={row.displayBalance}
        balanceTooltip={row.balanceTooltip}
        allocation={row.allocation}
        value={row.displayValue}
        $isLast={index === displayRows.length - 1}
        $rowIndex={index}
        onClick={() => onRowClick(row)}
        variant={isAccountDisplay ? 'accounts' : undefined}
      />
    );
  };

  if (displayRows.length <= 0) {
    return null;
  }

  return (
    <TableStructure $noMargin>
      <TableTitle width="full">
        <Container justify="space-between">
          <Typography variant="h5" color="muted">
            <LangDisplay
              text={
                isAccountDisplay
                  ? strings.portfolio.assetAllocation.accountTitle
                  : strings.portfolio.assetAllocation.title
              }
            />
          </Typography>
          {isAccountDisplay && (
            <Button
              variant="primary"
              onClick={() =>
                dispatch(
                  openAddAccountDialog({ coinId: parentAssetId, walletId }),
                )
              }
            >
              {strings.buttons.addAccount}
            </Button>
          )}
        </Container>
      </TableTitle>
      <AssetAllocationTableHeader
        account={strings.portfolio.assetAllocation.tableHeader.account}
        wallet={strings.portfolio.assetAllocation.tableHeader.wallet}
        asset={strings.portfolio.assetAllocation.tableHeader.asset}
        price={strings.portfolio.assetAllocation.tableHeader.price}
        balance={strings.portfolio.assetAllocation.tableHeader.balance}
        value={strings.portfolio.assetAllocation.tableHeader.value}
        allocation={strings.portfolio.assetAllocation.tableHeader.allocation}
        $ascending={isAscending}
        selected={sortedBy}
        onSort={onSort}
        variant={isAccountDisplay ? 'accounts' : undefined}
      />
      <Container
        height={
          ROW_HEIGHT * Math.min(displayRows.length, MAX_ROWS_DISPLAYED - 0.5)
        }
        width="100%"
        display="block"
      >
        <Virtualize.AutoSizer>
          {({ width, height }: any) => (
            <Virtualize.List
              className={CssClassNames.tableScrollbar}
              height={height}
              width={width}
              rowCount={displayRows.length}
              rowHeight={ROW_HEIGHT}
              rowRenderer={rowRenderer}
            />
          )}
        </Virtualize.AutoSizer>
      </Container>
    </TableStructure>
  );
};

AssetAllocation.defaultProps = {
  walletId: undefined,
  assetId: undefined,
  parentAssetId: undefined,
  accountId: undefined,
  withParentIconAtBottom: undefined,
  withSubIconAtBottom: undefined,
};

export default AssetAllocation;
