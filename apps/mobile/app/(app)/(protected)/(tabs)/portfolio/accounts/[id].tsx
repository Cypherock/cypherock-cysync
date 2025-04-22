import {
  Container,
  FilterButton,
  Flex,
  ScreenContainer,
  SelectFilterSheet,
} from '@/components/ui';
import { Graph } from '@/components/core';
import { useEffect, useMemo } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { CoinIcon, PortfolioHeader } from '@/components/core';
import { usePortfolioFilters } from '@/hooks';
import {
  selectAccounts,
  selectLanguage,
  selectWallets,
  useAppSelector,
} from '@/store';
import TokenTable from '@/components/core/TokenTable';
import { View } from 'react-native';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { ICoinInfo } from '@cypherock/coins';

export default function Accounts() {
  const { id: accountId } = useLocalSearchParams<{
    id: string;
    parentAssetId: string;
    assetId: string;
  }>();

  const navigation = useNavigation();
  const { accounts } = useAppSelector(selectAccounts);
  const { wallets } = useAppSelector(selectWallets);
  const { strings } = useAppSelector(selectLanguage);
  const {
    filters,
    filterRef,
    onFilterSelect,
    onHideFilter,
    selectedRange,
    selectedWallet,
    onShowFilter,
    onFilterReset,
  } = usePortfolioFilters();

  const selectedAccount = useMemo<
    | (IAccount & {
        asset?: ICoinInfo;
        parentAccount?: IAccount;
        wallet?: IWallet;
      })
    | undefined
  >(() => {
    const account = accounts.find(a => a.__id === accountId);

    if (account) {
      const wallet = wallets.find(a => a.__id === account.walletId);
      const { getAsset } = require('@cypherock/coin-support-utils');

      const result: IAccount & {
        asset?: ICoinInfo;
        parentAccount?: IAccount;
        wallet?: IWallet;
      } = { ...account, wallet };

      const asset = getAsset(account.parentAssetId, account.assetId);
      result.asset = asset;

      if (account.parentAccountId) {
        const parentAccount = accounts.find(
          a => a.__id === account.parentAccountId,
        );

        result.parentAccount = parentAccount;
      }

      return result;
    }

    return undefined;
  }, [accountId, accounts]);

  useEffect(() => {
    if (!selectedAccount) {
      router.dismiss();
      return;
    }
    navigation.setOptions({ title: selectedAccount.name });
    navigation.setOptions({
      headerLeft: () => (
        <CoinIcon parentAssetId={selectedAccount.assetId} size={20} />
      ),
    });
  }, [selectedAccount]);

  if (!selectedAccount) {
    return null;
  }

  return (
    <ScreenContainer>
      <PortfolioHeader />
      <View
        style={{ width: '100%', height: 324, paddingHorizontal: 12, gap: 24 }}
      >
        <Flex justifyContent="space-between">
          <Flex gap={4} style={{ flex: 1 }}>
            <FilterButton
              value={selectedWallet?.name}
              placeholder="All wallets"
              onPress={() => onShowFilter('wallets')}
            />
          </Flex>
          <Flex gap={4} style={{ flex: 1 }}>
            <FilterButton
              value={strings.graph.timeRange[selectedRange]}
              placeholder="1W"
              onPress={() => onShowFilter('time')}
            />
          </Flex>
        </Flex>
        <Graph
          key={accountId}
          selectedRange={selectedRange}
          accountId={accountId}
          selectedWallet={selectedWallet}
          color={selectedAccount.asset?.color}
        />
      </View>
      {(() => {
        const {
          getAssetOrUndefined,
        } = require('@cypherock/coin-support-utils');
        return (getAssetOrUndefined(selectedAccount.parentAssetId) as any)
          ?.tokens && accountId ? (
          <TokenTable accountId={accountId} />
        ) : (
          <TokenTable noData />
        );
      })()}
      <SelectFilterSheet
        ref={filterRef}
        title={'Select Option'}
        onSelect={onFilterSelect}
        data={filters}
        onHide={onHideFilter}
        onReset={onFilterReset}
      />
    </ScreenContainer>
  );
}
