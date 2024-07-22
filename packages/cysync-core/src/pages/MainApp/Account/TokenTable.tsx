import {
  TokenTableHeader,
  TableStructure,
  TokenTableHeaderName,
  TableTitle,
  Typography,
  LangDisplay,
  TokenTableRow,
  Container,
} from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useMemo, useState } from 'react';
import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';

import { useSubAccounts } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

export interface TokenProps {
  accountId: string;
  onClick: (id: string) => void;
}

const comparatorMap: Record<TokenTableHeaderName, string> = {
  amount: 'amount',
  value: 'value',
  token: 'assetName',
};

const ROW_HEIGHT = 82;
const MAX_ROWS_DISPLAYED = 5;

export const TokenTable: React.FC<TokenProps> = ({ accountId, onClick }) => {
  const { strings } = useAppSelector(selectLanguage);

  const { subAccounts } = useSubAccounts({
    accountId,
  });
  const [sortedBy, setSortedBy] = React.useState<TokenTableHeaderName>('value');
  const [isAscending, setIsAscending] = useState(false);

  const onSort = (columnName: TokenTableHeaderName) => {
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

  const rowRenderer = ({ key, index, style }: any) => {
    const row = displayRows[index];

    return (
      <TokenTableRow
        style={style}
        key={key}
        tokenAbbr={row.assetAbbr}
        tokenName={row.assetName}
        tokenIcon={row.assetIcon}
        balance={row.displayAmount}
        balanceTooltip={row.amountTooltip}
        value={row.displayValue}
        $isLast={index === displayRows.length - 1}
        $rowIndex={index}
        onClick={() => onClick(row.id ?? '')}
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
            <LangDisplay text={strings.portfolio.tokenTable.title} />
          </Typography>
        </Container>
      </TableTitle>
      <TokenTableHeader
        amount={strings.portfolio.tokenTable.tableHeader.amount}
        token={strings.portfolio.tokenTable.tableHeader.token}
        value={strings.portfolio.assetAllocation.tableHeader.value}
        $ascending={isAscending}
        selected={sortedBy}
        onSort={onSort}
      />
      <Container
        height={ROW_HEIGHT * Math.min(displayRows.length, MAX_ROWS_DISPLAYED)}
        width="100%"
        display="block"
      >
        <Virtualize.AutoSizer>
          {({ width, height }: any) => (
            <Virtualize.List
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
