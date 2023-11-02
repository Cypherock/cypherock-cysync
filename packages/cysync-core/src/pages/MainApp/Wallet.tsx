import {
  Breadcrumb,
  Flex,
  Button,
  TableSearch,
  TableStructure,
  BitcoinGray,
  SkeletonLoader,
  NoAccountWrapper,
  NoSearchResult,
  NotFound,
  AccountTableHeader,
  AccountTableRow,
  Container,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect, useRef, useState } from 'react';
import * as Virtualize from 'react-virtualized/dist/umd/react-virtualized';

import { useWalletPage } from './hooks';
import { MainAppLayout } from './Layout';
import { useWindowSize } from '~/hooks';

export const Wallet: FC = () => {
  const {
    accountList,
    lang,
    searchTerm,
    setSearchTerm,
    isAscending,
    onSort,
    handleAccountTableRow,
    displayedData,
    sortedBy,
    handleAddAccountClick,
    walletName,
    selectedWallet,
    onWalletChange,
    dropDownData,
    handleStatusClick,
  } = useWalletPage();

  const { windowHeight } = useWindowSize();
  const listRef = useRef<any>(null);
  const [topbarHeight, setTopbarHeight] = useState(0);

  useEffect(() => {
    if (listRef.current?.recomputeRowHeights) {
      listRef.current.recomputeRowHeights();
    }
  }, [displayedData]);

  const hasAccounts = accountList.length > 0;
  const rowRenderer = ({ index }: any) => {
    const row = displayedData[index];

    return (
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
        $isLast={index === displayedData.length - 1}
        $rowIndex={index}
        $hide={lang.strings.wallet.buttons.hide}
        $show={lang.strings.wallet.buttons.show}
        onClick={() => handleAccountTableRow(row)}
        onStatusClick={() => handleStatusClick(row)}
      />
    );
  };

  const getRowHeight = ({ index }: { index: number }) =>
    displayedData[index].tokens ? 130.6 : 85;

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
          {displayedData.length > 0 ? (
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
              <Virtualize.AutoSizer>
                {({ width }: any) => (
                  <Virtualize.List
                    ref={listRef}
                    height={windowHeight - topbarHeight - 268}
                    width={width}
                    rowCount={displayedData.length}
                    rowHeight={getRowHeight}
                    rowRenderer={rowRenderer}
                  />
                )}
              </Virtualize.AutoSizer>
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
      onTopbarHeightChange={setTopbarHeight}
    >
      <Container $noFlex m="20">
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
      </Container>
    </MainAppLayout>
  );
};
