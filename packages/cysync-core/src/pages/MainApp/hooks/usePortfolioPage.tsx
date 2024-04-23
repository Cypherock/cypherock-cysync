import { routes } from '~/constants';
import { CoinAllocationRow, useNavigateTo, useWalletDropdown } from '~/hooks';

export const usePortfolioPage = () => {
  const navigateTo = useNavigateTo();

  const { handleWalletChange, selectedWallet, walletDropdownList } =
    useWalletDropdown({ withSelectAll: true, dropdownWidth: 220 });

  const onAssetClick = (row: CoinAllocationRow) => {
    const { parentAssetId, assetId } = row;

    navigateTo(
      `${routes.asset.path}?parentAssetId=${parentAssetId}&assetId=${assetId}`,
    );
  };

  return {
    handleWalletChange,
    selectedWallet,
    walletDropdownList,
    onAssetClick,
  };
};
