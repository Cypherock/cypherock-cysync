import {
  Breadcrumb,
  Flex,
  Button,
  BitcoinGray,
  SkeletonLoader,
  NoAccountWrapper,
} from '@cypherock/cysync-ui';
import React, { FC, useCallback, useState } from 'react';

import logger from '~/utils/logger';

import { AccountTable } from './AccountTable';

import { useWalletPage } from '../hooks';
import { MainAppLayout } from '../Layout';

export const Wallet: FC = () => {
  const {
    accountList,
    lang,
    searchTerm,
    setSearchTerm,
    isAscending,
    onSort,
    handleAccountTableRow,
    sortedBy,
    handleAddAccountClick,
    handleAddTokenClick,
    walletName,
    selectedWallet,
    onWalletChange,
    dropDownData,
    handleStatusClick,
    displayedData,
  } = useWalletPage();
  const [topbarHeight, setTopbarHeight] = useState(0);

  const hasAccounts = accountList.length > 0;

  type HandlersType = typeof handleAddAccountClick & typeof handleAddTokenClick;
  const getHandlerProxy = useCallback(
    (clickInfo: string, source: string, func: HandlersType): HandlersType =>
      () => {
        logger.info(`Button Click: ${clickInfo}`, {
          source: `${Wallet.name}/${source}`,
        });
        func();
      },
    [],
  );

  const getMainContent = () => {
    if (hasAccounts) {
      return (
        <AccountTable
          onSort={onSort}
          sortedBy={sortedBy}
          isAscending={isAscending}
          onClick={handleAccountTableRow}
          onStatusClick={handleStatusClick}
          onTokenClick={handleAccountTableRow}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          accountRows={displayedData}
          topbarHeight={topbarHeight}
        />
      );
    }

    return (
      <NoAccountWrapper>
        <SkeletonLoader
          loader={<BitcoinGray />}
          text={lang.strings.wallet.accountMissing.text}
          subText={lang.strings.wallet.accountMissing.subText}
          $buttonOne={lang.strings.buttons.addAccount}
          onClick={getHandlerProxy(
            'Add Account',
            'NoAccountWrapper',
            handleAddAccountClick,
          )}
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
            <Button
              variant="primary"
              onClick={getHandlerProxy(
                'Add Account',
                'TopBar',
                handleAddAccountClick,
              )}
            >
              {lang.strings.buttons.addAccount}
            </Button>
          )}
          {hasAccounts && window.cysyncFeatureFlags.ADD_TOKEN && (
            <Button
              variant="primary"
              onClick={getHandlerProxy(
                'Add Token',
                'TopBar',
                handleAddTokenClick,
              )}
            >
              {lang.strings.buttons.addToken}
            </Button>
          )}
        </Flex>
      </Flex>
      {getMainContent()}
    </MainAppLayout>
  );
};
