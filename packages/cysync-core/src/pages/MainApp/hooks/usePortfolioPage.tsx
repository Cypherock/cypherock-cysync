import { useTheme } from '@cypherock/cysync-ui';

import { useWalletDropdown, useGraphTimeRange } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

export const usePortfolioPage = () => {
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);
  const { handleWalletChange, selectedWallet, walletDropdownList } =
    useWalletDropdown();
  const { rangeList, selectedRange, setSelectedRange } = useGraphTimeRange();

  return {
    lang,
    handleWalletChange,
    selectedWallet,
    walletDropdownList,
    rangeList,
    selectedRange,
    setSelectedRange,
    theme,
  };
};
