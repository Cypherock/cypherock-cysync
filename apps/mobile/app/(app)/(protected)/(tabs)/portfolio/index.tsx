import {
  Container,
  FilterButton,
  Flex,
  ScreenContainer,
  SelectFilterSheet,
} from '@/components/ui';
import { Graph, PortfolioHeader } from '@/components/core';
import { router } from 'expo-router';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';
import { usePortfolioFilters } from '@/hooks';
import { selectLanguage, selectWallets, useAppSelector } from '@/store';
import AllocationTable from '@/components/core/AllocationTable';

export default function Portfolio() {
  const { strings } = useAppSelector(selectLanguage);
  const { wallets } = useAppSelector(selectWallets);
  const {
    filters,
    selectedFilter,
    filterRef,
    onFilterSelect,
    onHideFilter,
    selectedRange,
    selectedWallet,
    onShowFilter,
  } = usePortfolioFilters();

  if (wallets.length === 0) {
    return (
      <NoDataScreen
        title={strings.portfolio.noAccount.title}
        description={strings.portfolio.noAccount.subTitle}
        onAction={() => router.push('/scan')}
        actionText={strings.buttons.scanQrCode}
      />
    );
  }

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
        <Graph selectedRange={selectedRange} />
      </Container>
      <AllocationTable isMain />
      {filters.length > 0 && selectedFilter && (
        <SelectFilterSheet
          ref={filterRef}
          title={'Select Option'}
          onSelect={onFilterSelect}
          data={filters}
          onHide={onHideFilter}
        />
      )}
    </ScreenContainer>
  );
}
