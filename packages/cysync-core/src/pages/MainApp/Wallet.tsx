import {
  WalletHeader,
  TableSearch,
  TableStructure,
  ShowMore,
  BitcoinGray,
  SkeletonLoader,
  NoAccountWrapper,
  NoSearchResult,
  NotFound,
  WalletContainer,
  AccountTableHeader,
  AccountTableRow,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { MainAppLayout } from './Components';
import { useWalletPage } from './hooks';

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
        <TableStructure>
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
                  leftImage={row.leftImage}
                  text={row.text}
                  subText={row.subText}
                  tag={row.tag}
                  statusImage={row.statusImage}
                  amount={row.displayAmount}
                  value={row.displayValue}
                  tokens={row.tokens}
                  $isLast={index === slicedData.length - 1 && !displayShowMore}
                  $rowIndex={index}
                  $hide={lang.strings.wallet.buttons.hide}
                  $show={lang.strings.wallet.buttons.show}
                  onClick={() => handleAccountTableRow(row)}
                  onStatusClick={() => handleStatusClick(row)}
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
      title={`${walletName}`}
      fullHeight={accountList.length === 0}
    >
      <WalletContainer>
        <WalletHeader
          title={`${lang.strings.wallet.title}`}
          breadcrumb={walletName}
          dropdown={dropDownData}
          selectedItem={selectedWallet?.__id ?? ''}
          setSelectedItem={onWalletChange}
          primaryActionText={
            hasAccounts ? lang.strings.buttons.addAccount : undefined
          }
          onPrimaryAction={hasAccounts ? handleAddAccountClick : undefined}
        />
        {getMainContent()}
      </WalletContainer>
    </MainAppLayout>
  );
};
