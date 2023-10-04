import { BtcIdMap, coinList } from '@cypherock/coins';
import {
  NoAccountWrapper,
  SkeletonLoader,
  GraphGreyIcon,
  Container,
  DisplayGraph,
} from '@cypherock/cysync-ui';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { openWalletConnectDialog } from '~/actions';
import { AssetAllocation, TransactionTable } from '~/components';

import { NoWallet } from './NoWallet';

import { usePortfolioPage } from '../hooks';
import { MainAppLayout } from '../Layout';

export const Portfolio: FC = () => {
  const {
    lang,
    handleWalletChange,
    selectedWallet,
    walletDropdownList,
    rangeList,
    selectedRange,
    setSelectedRange,
    graphData,
    formatTooltipValue,
    formatTimestamp,
    formatYAxisTick,
    summaryDetails,
    wallets,
    accounts,
    handleAddAccountClick,
    onAssetClick,
  } = usePortfolioPage();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(openWalletConnectDialog());
  }, []);

  const getMainContent = () => {
    if (wallets.length <= 0) {
      return <NoWallet />;
    }

    if (accounts.length <= 0) {
      return (
        <NoAccountWrapper>
          <SkeletonLoader
            loader={<GraphGreyIcon />}
            text={lang.strings.portfolio.accountMissing.text}
            subText={lang.strings.portfolio.accountMissing.subText}
            $buttonOne={lang.strings.buttons.addAccount}
            onClick={handleAddAccountClick}
            $noLoaderContainer
          />
        </NoAccountWrapper>
      );
    }

    return (
      <>
        <Container $noFlex mb={2}>
          <DisplayGraph
            title={summaryDetails.totalValue}
            subTitle={lang.strings.graph.totalBalance}
            dropdownItems={walletDropdownList}
            selectedDropdownItem={selectedWallet?.__id ?? 'all'}
            onDropdownChange={handleWalletChange}
            dropdownSearchText={lang.strings.graph.walletDropdown.search}
            pillButtonList={rangeList}
            selectedPill={selectedRange}
            onPillButtonChange={setSelectedRange as any}
            summaryText={summaryDetails.changePercent}
            summarySubText={summaryDetails.changeValue}
            summaryIcon={summaryDetails.changeIcon}
            data={graphData}
            formatTooltipValue={formatTooltipValue}
            formatTimestamp={formatTimestamp}
            formatYAxisTick={formatYAxisTick}
            color={coinList[BtcIdMap.bitcoin].color ?? ''}
          />
        </Container>

        <Container $noFlex mb={2}>
          <AssetAllocation
            walletId={selectedWallet?.__id}
            onRowClick={onAssetClick}
          />
        </Container>

        <Container $noFlex mb={2}>
          <TransactionTable limit={10} walletId={selectedWallet?.__id} />
        </Container>
      </>
    );
  };

  return (
    <MainAppLayout topbar={{ title: lang.strings.portfolio.title }}>
      <Container $noFlex m="20">
        {getMainContent()}
      </Container>
    </MainAppLayout>
  );
};
