import { routes } from '~/constants';
import { analyticsService, ANALYTICS_EVENTS } from '~/services/analytics';
import { CoinAllocationRow, useNavigateTo, useWalletDropdown } from '~/hooks';

export const usePortfolioPage = () => {
  const navigateTo = useNavigateTo();

  const {
    handleWalletChange: originalHandleWalletChange,
    selectedWallet,
    walletDropdownList,
  } = useWalletDropdown({ withSelectAll: true, dropdownWidth: 220 });

  const handleWalletChange = (walletId?: string) => {
    if (walletId) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.PORTFOLIO_WALLET_SELECTED);
    }
    originalHandleWalletChange(walletId);
  };

  const onAssetClick = (row: CoinAllocationRow) => {
    const { parentAssetId, assetId } = row;

    analyticsService.trackEvent(ANALYTICS_EVENTS.PORTFOLIO_ASSET_CLICKED, {
      assetId,
      parentAssetId,
    });

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
