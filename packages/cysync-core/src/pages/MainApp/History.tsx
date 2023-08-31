import {
  ArrowReceivedIcon,
  Container,
  NoAccountWrapper,
  SkeletonLoader,
  useTheme,
  TableStructure,
  TableSearchFilter,
  NoSearchResult,
  NotFound,
  TransactionTableHeader,
  TransactionTableRow,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { openReceiveDialog } from '~/actions';

import { MainAppLayout } from './Components';
import { useHistoryPage } from './hooks';

export const History: FC = () => {
  const {
    strings,
    displayedData,
    dispatch,
    searchTerm,
    setSearchTerm,
    transactionList,
    handleTransactionTableRow,
    isAscending,
    sortedBy,
    onSort,
    isSmallScreen,
  } = useHistoryPage();
  const theme = useTheme();

  const getMainContent = () => {
    if (transactionList.length <= 0)
      return (
        <NoAccountWrapper>
          <SkeletonLoader
            loader={<ArrowReceivedIcon fill={theme.palette.text.success} />}
            text={strings.history.noData.text}
            subText={strings.history.noData.subText}
            $buttonOne={strings.history.noData.buttonText}
            onClick={() => dispatch(openReceiveDialog())}
          />
        </NoAccountWrapper>
      );

    return (
      <TableStructure>
        <TableSearchFilter
          placeholder={strings.history.search.placeholder}
          value={searchTerm}
          onChange={setSearchTerm}
        />
        {displayedData.length > 0 ? (
          <>
            <TransactionTableHeader
              time={strings.history.tableHeader.time}
              account={strings.history.tableHeader.account}
              asset={strings.history.tableHeader.asset}
              value={strings.history.tableHeader.value}
              amount={strings.history.tableHeader.amount}
              $ascending={isAscending}
              selected={sortedBy}
              onSort={onSort}
              isSmallScreen={isSmallScreen}
            />
            {displayedData.map((row, index) => (
              <TransactionTableRow
                key={row.id}
                id={row.id}
                icon={row.icon}
                assetIcon={<row.assetIcon width="24px" height="24px" />}
                accountIcon={<row.accountIcon width="16px" height="16px" />}
                type={row.type}
                status={row.status}
                time={row.time}
                date={row.date}
                asset={row.assetName}
                wallet={row.walletName}
                account={row.accountName}
                amount={row.displayAmount}
                value={row.displayValue}
                $isLast={index === displayedData.length - 1}
                $rowIndex={index}
                onClick={() => handleTransactionTableRow(row)}
                isSmallScreen={isSmallScreen}
                accountHeader={strings.history.tableHeader.account}
                valueHeader={strings.history.tableHeader.value}
              />
            ))}
          </>
        ) : (
          <NoSearchResult
            image={<NotFound />}
            text={strings.history.search.notFound.text}
            subText={strings.history.search.notFound.subText}
            searchText={searchTerm}
          />
        )}
      </TableStructure>
    );
  };

  return (
    <MainAppLayout title={strings.sidebar.history}>
      <Container $noFlex m="20">
        {getMainContent()}
      </Container>
    </MainAppLayout>
  );
};
