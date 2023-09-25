import { getAsset } from '@cypherock/coin-support-utils';
import { ICoinInfo } from '@cypherock/coins';
import {
  BreadcrumbDropdownItem,
  BreadcrumbItem,
  Container,
  Tag,
  Typography,
} from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { useMemo } from 'react';

import { CoinIcon } from '~/components';
import { routes } from '~/constants';
import {
  CoinAllocationRow,
  useAssetDropdown,
  useGraph,
  useNavigateTo,
  useQuery,
} from '~/hooks';
import {
  selectAccounts,
  selectLanguage,
  selectWallets,
  useAppSelector,
} from '~/store';

const selector = createSelector(
  [selectAccounts, selectWallets, selectLanguage],
  ({ accounts }, { wallets }, lang) => ({ accounts, wallets, lang }),
);

export const useAccountPage = () => {
  const query = useQuery();
  const navigateTo = useNavigateTo();
  const { accounts, wallets, lang } = useAppSelector(selector);

  const accountId = useMemo(() => query.get('accountId') ?? undefined, [query]);

  const selectedAccount = useMemo<
    (IAccount & { asset?: ICoinInfo; parentAccount?: IAccount }) | undefined
  >(() => {
    const id = query.get('accountId');

    const account = accounts.find(a => a.__id === id);

    if (account) {
      const result: IAccount & { asset?: ICoinInfo; parentAccount?: IAccount } =
        { ...account };

      const asset = getAsset(account.parentAssetId, account.assetId);
      result.asset = asset;

      if (account.parentAccountId) {
        const parentAccount = accounts.find(
          a => a.__id === account.parentAccountId,
        );

        result.parentAccount = parentAccount;
      }

      return result;
    }
    navigateTo(routes.portfolio.path);
    return undefined;
  }, [query, accounts]);

  const fromAsset = useMemo(() => {
    const parentAssetId = query.get('fromParentAssetId');

    if (parentAssetId) {
      return {
        asset: getAsset(parentAssetId),
        parentAssetId,
        assetId: parentAssetId,
      };
    }

    return undefined;
  }, [query]);

  const fromWallet = useMemo(() => {
    const fromWalletId = query.get('fromWalletId');

    if (fromWalletId) {
      return wallets.find(w => w.__id === fromWalletId);
    }

    return undefined;
  }, [query, wallets]);

  const graphData = useGraph({ accountId });
  const assetDropdown = useAssetDropdown();

  const accountDropdownList: BreadcrumbDropdownItem[] = useMemo(
    () =>
      accounts
        .filter(
          a =>
            a.type === 'account' &&
            (!fromWallet || fromWallet.__id === a.walletId) &&
            (!fromAsset || fromAsset.parentAssetId === a.parentAssetId),
        )
        .map(a => ({
          id: a.__id ?? '',
          displayNode: (
            <Container direction="row">
              <CoinIcon
                size="16px"
                subIconSize="10px"
                parentAssetId={a.parentAssetId}
              />
              <Typography mx={1} color="muted">
                {a.name}
              </Typography>
              {a.derivationScheme && (
                <Tag>{lodash.upperCase(a.derivationScheme)}</Tag>
              )}
            </Container>
          ),
          checkType: 'radio',
        })),
    [accounts, fromWallet],
  );

  const onAccountChange = (id: string) => {
    const params = new URLSearchParams(query.toString());
    params.set('accountId', id);
    navigateTo(`${routes.account.path}?${params}`);
  };

  const onAssetClick = (row: CoinAllocationRow) => {
    onAccountChange(row.accountId ?? '');
  };

  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const accountItem = {
      id: 'account',
      dropdown: {
        displayNode: (
          <Container direction="row">
            <CoinIcon
              parentAssetId={selectedAccount?.parentAssetId ?? ''}
              assetId={selectedAccount?.assetId}
              withParentIconAtBottom
              subIconSize="10px"
              size="16px"
            />
            <Typography ml={1}>{selectedAccount?.name}</Typography>
          </Container>
        ),
        selectedItem: selectedAccount?.__id ?? '',
        setSelectedItem: onAccountChange,
        dropdown: accountDropdownList,
      },
    };

    if (fromAsset) {
      return [
        {
          id: 'portfolio',
          text: lang.strings.portfolio.title,
          onClick: () => navigateTo(routes.portfolio.path),
        },
        {
          id: 'asset',
          dropdown: {
            displayNode: (
              <Container direction="row">
                <CoinIcon
                  parentAssetId={fromAsset.parentAssetId ?? ''}
                  assetId={fromAsset.assetId}
                  withParentIconAtBottom
                  subIconSize="10px"
                  size="16px"
                />
                <Typography ml={1}>{fromAsset.asset.name}</Typography>
              </Container>
            ),
            selectedItem: `${fromAsset.parentAssetId}/${fromAsset.assetId}`,
            setSelectedItem: assetDropdown.onAssetChange,
            dropdown: assetDropdown.assetDropdownList,
          },
        },
        accountItem,
      ];
    }
    if (fromWallet) {
      return [
        {
          id: 'wallet',
          text: lang.strings.wallet.title,
          onClick: () => navigateTo(routes.wallet.path),
        },
        {
          id: 'walletList',
          dropdown: {
            displayNode: fromWallet.name,
            selectedItem: fromWallet.__id ?? '',
            setSelectedItem: (id: string) =>
              navigateTo(`${routes.wallet.path}?id=${id}`),
            dropdown: wallets.map(w => ({
              id: w.__id ?? '',
              text: w.name,
              checkType: 'radio',
            })),
          },
        },
        accountItem,
      ];
    }

    return [accountItem];
  }, [
    assetDropdown,
    selectedAccount,
    wallets,
    fromAsset,
    fromWallet,
    accountDropdownList,
  ]);

  return {
    ...graphData,
    ...assetDropdown,
    ...accountDropdownList,
    breadcrumbItems,
    accountId,
    selectedAccount,
    onAssetClick,
  };
};
