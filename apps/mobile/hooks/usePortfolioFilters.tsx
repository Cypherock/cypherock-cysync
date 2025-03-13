import { IFilterDataType } from '@/components/ui';
import { GraphTimeRange, GraphTimeRangeMap, useGraphTimeRange } from '@/hooks';
import { selectWallets, useAppSelector } from '@/store';
import { IWallet } from '@cypherock/db-interfaces';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState, useCallback, useEffect } from 'react';

type FilterKeys = 'wallets' | 'time';

interface IPortfolioFilters {
  filters: IFilterDataType[];
  selectedFilter?: FilterKeys;
  selectedRange: GraphTimeRange;
  filterRef: React.MutableRefObject<BottomSheetModal | null>;
  onFilterSelect: (id: string) => void;
  onHideFilter: () => void;
  onShowFilter: (key: FilterKeys) => void;
  selectedWallet?: IWallet;
  onFilterReset: () => void;
}

export const usePortfolioFilters = (): IPortfolioFilters => {
  const { wallets } = useAppSelector(selectWallets);
  const filterRef = useRef<BottomSheetModal | null>(null);
  const { setSelectedRange, selectedRange, rangeList } = useGraphTimeRange();
  const [filters, setFilters] = useState<IFilterDataType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    FilterKeys | undefined
  >();
  const [selectedWallet, setSelectedWallet] = useState<IWallet>();
  const [formatedWalletList, setFormatedWalletList] = useState<
    IFilterDataType[]
  >([]);

  useEffect(() => {
    const walletList = wallets.map(wallet => ({
      text: wallet.name,
      id: wallet.__id ?? '',
    }));
    setFormatedWalletList(walletList);
  }, [wallets]);

  const handleShowFilter = (key: FilterKeys) => {
    setSelectedFilter(key);
    if (key === 'time') {
      setFilters(rangeList);
      filterRef.current?.present();
    } else if (key === 'wallets') {
      setFilters([{ text: 'All Wallets', id: '' }, ...formatedWalletList]);
      filterRef.current?.present();
    } else {
      throw Error('Invalid filter selected');
    }
  };

  const handleHideFilter = useCallback(() => {
    filterRef.current?.close();
  }, []);

  const handleFilterSelectMap: Record<FilterKeys, (id: string) => void> = {
    time: id => {
      setSelectedRange(GraphTimeRangeMap[id as keyof typeof GraphTimeRangeMap]);
    },
    wallets: (id: string) => {
      if (!id) {
        setSelectedWallet(undefined);
        return;
      }
      const wallet = wallets.find(w => w.__id === id);
      setSelectedWallet(wallet);
    },
  };

  const resetFitlers = useCallback(() => {
    setSelectedWallet(undefined);
  }, []);

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
    selectedWallet,
    onFilterReset: resetFitlers,
  };
};
