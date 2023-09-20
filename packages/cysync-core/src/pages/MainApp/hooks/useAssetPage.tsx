import { getAsset } from '@cypherock/coin-support-utils';
import { useMemo } from 'react';

import { routes } from '~/constants';
import { useGraph, useNavigateTo, useQuery } from '~/hooks';

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

  const onAssetClick = (_parentAssetId: string, _assetId: string) => {
    // TODO: handle navitation to coin page
    console.log({ _parentAssetId, _assetId });
  };

  return {
    ...graphData,
    selectedAsset,
    onAssetClick,
    parentAssetId,
    assetId,
  };
};
