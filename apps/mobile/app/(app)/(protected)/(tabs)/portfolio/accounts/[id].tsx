import {
  Container,
  FilterButton,
  Flex,
  ScreenContainer,
  SelectFilterSheet,
} from '@/components/ui';
import { Graph } from '@/components/core';
import { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { CoinIcon, PortfolioHeader } from '@/components/core';
import AllocationTable from '@/components/core/AllocationTable';
import { usePortfolioFilters } from '@/hooks';
import { selectAccounts, selectLanguage, useAppSelector } from '@/store';
import useShowAfterDelay from '@/hooks/useShowAfterDelay';

export default function Accounts() {
  const { id } = useLocalSearchParams() as { id: string };
  const navigation = useNavigation();
  const { accounts } = useAppSelector(selectAccounts);
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
  const showGraph = useShowAfterDelay();
  const accountId = id as string;
  const selectedAccount = accounts.find(ac => ac.__id === accountId);

  useEffect(() => {
    if (!selectedAccount) return;
    navigation.setOptions({ title: selectedAccount.name });
    navigation.setOptions({
      headerLeft: () => (
        <CoinIcon parentAssetId={selectedAccount.assetId} size={14} />
      ),
    });
  }, [selectedAccount]);

  return (
    <ScreenContainer>
      <PortfolioHeader />
      <Container style={{ paddingHorizontal: 12, gap: 24 }}>
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
        {showGraph ?? (
          <Graph
            selectedRange={selectedRange}
            accountId={accountId}
            selectedWallet={selectedWallet}
          />
        )}
      </Container>
      <AllocationTable accountId={accountId} walletId={selectedWallet?.__id} />
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
