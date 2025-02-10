import { IFilterDataType } from '@/components/ui';
import { GraphTimeRange, GraphTimeRangeMap, useGraphTimeRange } from '@/hooks';
import { selectWallets, useAppSelector } from '@/store';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState, useCallback } from 'react';

type FilterKeys = 'wallets' | 'time';

interface IPortfolioFilters {
  filters: IFilterDataType[];
  selectedFilter?: FilterKeys;
  selectedRange: GraphTimeRange;
  filterRef: React.MutableRefObject<BottomSheetModal | null>;
  onFilterSelect: (id: string) => void;
  onHideFilter: () => void;
  onShowFilter: (key: FilterKeys) => void;
}

export const usePortfolioFilters = (): IPortfolioFilters => {
  const { wallets } = useAppSelector(selectWallets);
  const filterRef = useRef<BottomSheetModal | null>(null);
  const { setSelectedRange, selectedRange, rangeList } = useGraphTimeRange();
  const [filters, setFilters] = useState<IFilterDataType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    FilterKeys | undefined
  >();

  const handleShowFilter = useCallback((key: FilterKeys) => {
    setSelectedFilter(key);
    if (key === 'time') {
      setFilters(rangeList);
    } else {
      setFilters(
        wallets.map(wallet => ({ text: wallet.name, id: wallet.__id ?? '' })),
      );
    }
    filterRef.current?.present();
  }, []);

  const handleHideFilter = useCallback(() => {
    filterRef.current?.close();
  }, []);

  const handleFilterSelectMap: Record<FilterKeys, (id: string) => void> = {
    time: id => {
      setSelectedRange(GraphTimeRangeMap[id as keyof typeof GraphTimeRangeMap]);
    },
    wallets: (id: string) =>
      console.log(
        `Selected wallet id: ${wallets.find(w => w.__id === id)?.name}`,
      ),
  };

  return {
    filters,
    selectedFilter,
    filterRef,
    onShowFilter: handleShowFilter,
    onHideFilter: handleHideFilter,
    onFilterSelect: selectedFilter
      ? handleFilterSelectMap[selectedFilter]
      : () => {},
    selectedRange,
  };
};
