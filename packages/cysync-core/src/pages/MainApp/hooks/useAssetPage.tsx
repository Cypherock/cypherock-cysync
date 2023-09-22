import { getAsset } from '@cypherock/coin-support-utils';
import { BreadcrumbDropdownItem } from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useMemo } from 'react';

import { CoinIcon } from '~/components';
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

  const assetDropdownList: BreadcrumbDropdownItem[] = useMemo(
    () =>
      lodash
        .uniqWith(
          graphData.accounts.map(account => ({
            assetId: account.assetId,
            parentAssetId: account.parentAssetId,
          })),
          (a, b) =>
            a.assetId === b.assetId && a.parentAssetId === b.parentAssetId,
        )
        .map(a => ({
          id: `${a.parentAssetId}/${a.assetId}`,
          text: getAsset(a.parentAssetId, a.assetId).name,
          icon: (
            <CoinIcon
              size="16px"
              withParentIconAtBottom
              subIconSize="10px"
              parentAssetId={a.parentAssetId}
              assetId={a.assetId}
            />
          ),
          checkType: 'radio',
        })),
    [graphData.accounts],
  );

  const onAssetChange = (id: string) => {
    const [_parentAssetId, _assetId] = id.split('/');

    navigateTo(
      `${routes.asset.path}?parentAssetId=${_parentAssetId}&assetId=${_assetId}`,
    );
  };

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
    assetDropdownList,
    onAssetChange,
  };
};
