import {
  ShowMore,
  TableStructure,
  TableTitle,
  Typography,
  LangDisplay,
  TransactionTableHeader,
  TableGroupRow,
  TransactionTableRow,
  TransactionTableVariant,
} from '@cypherock/cysync-ui';
import React from 'react';

import { routes } from '~/constants';
import { useNavigateTo, useTransactions } from '~/hooks';

export interface TransactionTableProps {
  walletId?: string;
  assetId?: string;
  parentAssetId?: string;
  accountId?: string;
  variant?: TransactionTableVariant;
  limit: number;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  walletId,
  assetId,
  parentAssetId,
  accountId,
  limit,
  variant,
}) => {
  const {
    strings,
    displayedData,
    handleTransactionTableRow,
    isAscending,
    sortedBy,
    onSort,
    isSmallScreen,
    expandedRowIds,
    onRowExpand,
  } = useTransactions({ walletId, assetId, parentAssetId, accountId });

  const navigateTo = useNavigateTo();

  const goToHistory = () => {
    navigateTo(routes.history.path);
  };

  const hasMoreThanLimit = displayedData.length > limit;

  if (displayedData.length <= 0) return null;

  return (
    <TableStructure $noMargin>
      <TableTitle width="full">
        <Typography variant="h5" color="muted">
          <LangDisplay text={strings.history.tableTitle} />
        </Typography>
      </TableTitle>
      <TransactionTableHeader
        time={strings.history.tableHeader.time}
        account={strings.history.tableHeader.account}
        wallet={strings.history.tableHeader.wallet}
        walletAndAccount={strings.history.tableHeader.walletAndAccount}
        asset={strings.history.tableHeader.asset}
        value={strings.history.tableHeader.value}
        amount={strings.history.tableHeader.amount}
        $ascending={isAscending}
        selected={sortedBy}
        onSort={onSort}
        isSmallScreen={isSmallScreen}
        variant={variant}
      />
      {displayedData.slice(0, limit).map((row, index, arr) => {
        const isLast = index === arr.length - 1;

        if (row.isGroupHeader && isLast) {
          return null;
        }

        if (row.isGroupHeader) {
          return <TableGroupRow key={row.id} text={row.groupText ?? ''} />;
        }

        return (
          <TransactionTableRow
            key={row.id}
            id={row.id}
            icon={row.icon}
            assetIcon={<row.assetIcon width="24px" height="24px" />}
            accountIcon={<row.accountIcon width="16px" height="16px" />}
            type={row.type}
            status={row.status}
            time={row.time}
            asset={row.assetName}
            wallet={row.walletName}
            account={row.accountName}
            accountTag={row.accountTag}
            amount={row.displayAmount}
            amountTooltip={row.amountTooltip}
            value={row.displayValue}
            $isLast={isLast && !hasMoreThanLimit}
            $rowIndex={index}
            onClick={() => handleTransactionTableRow(row)}
            isSmallScreen={isSmallScreen}
            accountHeader={strings.history.tableHeader.account}
            valueHeader={strings.history.tableHeader.value}
            isExpanded={expandedRowIds[row.id]}
            setIsExpanded={value => onRowExpand(row, value)}
            variant={variant}
          />
        );
      })}
      {hasMoreThanLimit && (
        <ShowMore text={strings.buttons.showAll} onClick={goToHistory} />
      )}
    </TableStructure>
  );
};

TransactionTable.defaultProps = {
  walletId: undefined,
  assetId: undefined,
  parentAssetId: undefined,
  accountId: undefined,
  variant: 'default',
};

export default TransactionTable;
