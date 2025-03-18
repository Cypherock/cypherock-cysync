import {
  FilterButton,
  Flex,
  ScreenContainer,
  SelectFilterSheet,
} from '@/components/ui';
import { Graph, PortfolioHeader } from '@/components/core';
import { router, useNavigation } from 'expo-router';
import NoDataScreen from '@/components/ui/molecules/NoDataScreen';
import { CoinAllocationRow, usePortfolioFilters } from '@/hooks';
import { selectLanguage, selectWallets, useAppSelector } from '@/store';
import AllocationTable from '@/components/core/AllocationTable';
import useShowAfterDelay from '@/hooks/useShowAfterDelay';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function Portfolio() {
  const { strings } = useAppSelector(selectLanguage);
  const { wallets } = useAppSelector(selectWallets);
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
  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
      }
    });
  }, []);

  function handleAssetClick(item: CoinAllocationRow) {
    router.push({
      pathname: '/portfolio/coins/[id]',
      params: {
        id: item.assetId,
        parentAssetId: item.parentAssetId,
        assetName: item.assetName,
      },
    });
  }

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
      <View
        style={{
          width: '100%',
          height: 324,
          paddingHorizontal: 12,
          gap: 24,
        }}
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
        {showGraph && (
          <Graph
            key={selectedRange}
            selectedRange={selectedRange}
            selectedWallet={selectedWallet}
          />
        )}
      </View>
      <AllocationTable
        onItemClick={handleAssetClick}
        walletId={selectedWallet?.__id}
        withParentIconAtBottom
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
