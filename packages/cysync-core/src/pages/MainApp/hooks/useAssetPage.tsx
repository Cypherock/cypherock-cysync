import { getAsset } from '@cypherock/coin-support-utils';
import { useMemo } from 'react';

import { routes } from '~/constants';
import {
  CoinAllocationRow,
  useAssetDropdown,
  useGraph,
  useNavigateTo,
  useQuery,
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

  const graphData = useGraph({ parentAssetId, assetId });
  const assetDropdown = useAssetDropdown();

  const onAccountClick = (row: CoinAllocationRow) => {
    navigateTo(
      `${routes.account.path}?accountId=${row.accountId}&fromParentAssetId=${parentAssetId}&fromAssetId=${assetId}`,
    );
  };

  return {
    ...graphData,
    ...assetDropdown,
    selectedAsset,
    onAccountClick,
    parentAssetId,
    assetId,
  };
};
