import {
  Breadcrumb,
  Flex,
  Button,
  TableSearch,
  TableStructure,
  ShowMore,
  BitcoinGray,
  SkeletonLoader,
  NoAccountWrapper,
  NoSearchResult,
  NotFound,
  AccountTableHeader,
  AccountTableRow,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useWalletPage } from './hooks';
import { MainAppLayout } from './Layout';

export const Wallet: FC = () => {
  const {
    accountList,
    lang,
    searchTerm,
    setSearchTerm,
    slicedData,
    isAscending,
    onSort,
    handleAccountTableRow,
    handleShowMore,
    displayedData,
    ITEMS_PER_PAGE,
    sortedBy,
    showMoreClicked,
    handleAddAccountClick,
    walletName,
    selectedWallet,
    onWalletChange,
    dropDownData,
    handleStatusClick,
  } = useWalletPage();

  const displayShowMore = displayedData.length > ITEMS_PER_PAGE;

  const hasAccounts = accountList.length > 0;

  const getMainContent = () => {
    if (hasAccounts) {
      return (
        <TableStructure mt={0}>
          <TableSearch
            placeholder={lang.strings.wallet.search.placeholder}
            heading={lang.strings.wallet.tableTitle}
            value={searchTerm}
            onChange={setSearchTerm}
          />
          {slicedData.length > 0 ? (
            <>
              <AccountTableHeader
                account={lang.strings.wallet.tableHeader.account}
                syncStatus={lang.strings.wallet.tableHeader.syncStatus}
                balance={lang.strings.wallet.tableHeader.balance}
                value={lang.strings.wallet.tableHeader.value}
                $ascending={isAscending}
                selected={sortedBy}
                onSort={onSort}
              />
              {slicedData.map((row, index) => (
                <AccountTableRow
                  key={row.id}
                  id={row.id}
                  leftImage={row.leftImage}
                  text={row.text}
                  subText={row.subText}
                  tag={row.tag}
                  statusImage={row.statusImage}
                  amount={row.displayAmount}
                  value={row.displayValue}
                  tokens={row.tokens?.map(t => ({
                    ...t,
                    amount: t.displayAmount,
                    value: t.displayValue,
                  }))}
                  $isLast={index === slicedData.length - 1 && !displayShowMore}
                  $rowIndex={index}
                  $hide={lang.strings.wallet.buttons.hide}
                  $show={lang.strings.wallet.buttons.show}
                  onClick={() => handleAccountTableRow(row.id)}
                  onStatusClick={() => handleStatusClick(row)}
                  onTokenClick={handleAccountTableRow}
                />
              ))}
              {displayShowMore && (
                <ShowMore
                  onClick={handleShowMore}
                  text={
                    showMoreClicked
                      ? lang.strings.wallet.buttons.less
                      : lang.strings.wallet.buttons.more
                  }
                />
              )}
            </>
          ) : (
            <NoSearchResult
              image={<NotFound />}
              text={lang.strings.wallet.search.text}
              subText={lang.strings.wallet.search.subText}
              searchText={searchTerm}
            />
          )}
        </TableStructure>
      );
    }

    return (
      <NoAccountWrapper>
        <SkeletonLoader
          loader={<BitcoinGray />}
          text={lang.strings.wallet.accountMissing.text}
          subText={lang.strings.wallet.accountMissing.subText}
          $buttonOne={lang.strings.buttons.addAccount}
          onClick={handleAddAccountClick}
        />
      </NoAccountWrapper>
    );
  };

  return (
    <MainAppLayout
      topbar={{ title: `${walletName}` }}
      fullHeight={accountList.length === 0}
    >
      <Flex justify="space-between" pt="10px" px="20px" mt={2}>
        <Breadcrumb
          items={[
            {
              id: 'wallet',
              text: lang.strings.wallet.title,
            },
            {
              id: 'walletList',
              dropdown: {
                displayNode: walletName,
                selectedItem: selectedWallet?.__id ?? '',
                setSelectedItem: onWalletChange,
                dropdown: dropDownData,
              },
            },
          ]}
        />
        <Flex gap={24}>
          {hasAccounts && (
            <Button variant="primary" onClick={handleAddAccountClick}>
              {lang.strings.buttons.addAccount}
            </Button>
          )}
        </Flex>
      </Flex>
      {getMainContent()}
    </MainAppLayout>
  );
};
