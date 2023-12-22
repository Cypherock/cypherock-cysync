import { getAsset } from '@cypherock/coin-support-utils';
import { useMemo } from 'react';

import { routes } from '~/constants';
import {
  CoinAllocationRow,
  useAssetDropdown,
  useNavigateTo,
  useQuery,
  useWalletDropdown,
} from '~/hooks';

export const useAssetPage = () => {
  const query = useQuery();
  const navigateTo = useNavigateTo();

  const parentAssetId = useMemo(
    () => query.get('parentAssetId') ?? undefined,
    [query],
  );
  const assetId = useMemo(() => query.get('assetId') ?? undefined, [query]);
  const selectedAsset = useMemo(() => {
    try {
      return getAsset(
        query.get('parentAssetId') ?? '',
        query.get('assetId') ?? undefined,
      );
    } catch (error) {
      navigateTo(routes.portfolio.path);
      return undefined;
    }
  }, [query]);

  const { handleWalletChange, selectedWallet, walletDropdownList } =
    useWalletDropdown({ withSelectAll: true });
  const assetDropdown = useAssetDropdown();

  const onAccountClick = (row: CoinAllocationRow) => {
    navigateTo(
      `${routes.account.path}?accountId=${row.accountId}&fromParentAssetId=${parentAssetId}&fromAssetId=${assetId}`,
    );
  };

  return {
    ...assetDropdown,
    handleWalletChange,
    selectedWallet,
    walletDropdownList,
    selectedAsset,
    onAccountClick,
    parentAssetId,
    assetId,
  };
};
