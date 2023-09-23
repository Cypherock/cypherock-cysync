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

import { useSubAccounts } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

export interface TokenProps {
  accountId: string;
}

const comparatorMap: Record<TokenTableHeaderName, string> = {
  amount: 'amount',
  value: 'value',
  token: 'assetName',
};

export const TokenTable: React.FC<TokenProps> = ({ accountId }) => {
  const { strings } = useAppSelector(selectLanguage);

  const { onSubAccountClick, subAccounts } = useSubAccounts({
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
      {displayRows.map((row, index) => (
        <TokenTableRow
          key={row.id}
          tokenAbbr={row.assetAbbr}
          tokenName={row.assetName}
          tokenIcon={row.assetIcon}
          balance={row.displayAmount}
          value={row.displayValue}
          $isLast={index === displayRows.length - 1}
          $rowIndex={index}
          onClick={() => onSubAccountClick(row.id ?? '')}
        />
      ))}
    </TableStructure>
  );
};
