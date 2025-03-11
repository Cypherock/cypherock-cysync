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
  const { parentAssetId, id, assetName } = useLocalSearchParams<{
    parentAssetId: string;
    id: string;
    assetName: string;
  }>();
  const navigation = useNavigation();
  const showGraph = useShowAfterDelay();

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

  useEffect(() => {
    if (!parentAssetId) return;
    navigation.setOptions({ title: assetName });
    navigation.setOptions({
      headerLeft: () => (
        <CoinIcon
          assetId={id}
          parentAssetId={parentAssetId}
          size={24}
          subIconSize={10}
          subContainerSize={12}
          withParentIconAtBottom
          withBackground
        />
      ),
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
