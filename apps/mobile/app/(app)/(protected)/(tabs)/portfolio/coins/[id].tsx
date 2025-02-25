import {
  Container,
  FilterButton,
  Flex,
  ScreenContainer,
  SelectFilterSheet,
} from '@/components/ui';
import { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { CoinIcon, Graph, PortfolioHeader } from '@/components/core';
import AllocationTable from '@/components/core/AllocationTable';
import { usePortfolioFilters } from '@/hooks';
import { selectLanguage, useAppSelector } from '@/store';
import useShowAfterDelay from '@/hooks/useShowAfterDelay';

export default function Coins() {
  const { id } = useLocalSearchParams() as { id: string };
  const navigation = useNavigation();
  const showGraph = useShowAfterDelay();

  const { strings } = useAppSelector(selectLanguage);
  const {
    filters,
    selectedFilter,
    filterRef,
    onFilterSelect,
    onHideFilter,
    selectedRange,
    selectedWallet,
    onShowFilter,
    onFilterReset,
  } = usePortfolioFilters();
  const parentAssetId = id as string;

  useEffect(() => {
    if (!parentAssetId) return;
    navigation.setOptions({ title: id });
    navigation.setOptions({
      headerLeft: () => <CoinIcon parentAssetId={parentAssetId} size={14} />,
    });
  }, [parentAssetId]);

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
        {showGraph && (
          <Graph
            selectedRange={selectedRange}
            parentAssetId={parentAssetId}
            selectedWallet={selectedWallet}
          />
        )}
      </Container>
      <AllocationTable
        parentAssetId={parentAssetId}
        walletId={selectedWallet?.__id}
      />
      {filters.length > 0 && selectedFilter && (
        <SelectFilterSheet
          ref={filterRef}
          title={'Select Option'}
          onSelect={onFilterSelect}
          data={filters}
          onHide={onHideFilter}
          onReset={onFilterReset}
        />
      )}
    </ScreenContainer>
  );
}
