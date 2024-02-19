import { getAsset } from '@cypherock/coin-support-utils';
import { BreadcrumbDropdownItem } from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useMemo } from 'react';

import { useNavigateTo } from './useNavigateTo';

import { CoinIcon, routes, selectUnHiddenAccounts, useAppSelector } from '..';

export const useAssetDropdown = () => {
  const navigateTo = useNavigateTo();
  const { accounts } = useAppSelector(selectUnHiddenAccounts);

  const assetDropdownList: BreadcrumbDropdownItem[] = useMemo(
    () =>
      lodash
        .uniqWith(
          accounts.map(account => ({
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
              withParentIconAtBottom
              subIconSize="8px"
              subContainerSize="12px"
              size="16px"
              parentAssetId={a.parentAssetId}
              assetId={a.assetId}
            />
          ),
          checkType: 'radio',
        })),
    [accounts],
  );

  const onAssetChange = (id: string) => {
    const [_parentAssetId, _assetId] = id.split('/');

    navigateTo(
      `${routes.asset.path}?parentAssetId=${_parentAssetId}&assetId=${_assetId}`,
    );
  };

  return {
    assetDropdownList,
    onAssetChange,
  };
};
