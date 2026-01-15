import { getAsset } from '@cypherock/coin-support-utils';
import { ICoinInfo } from '@cypherock/coins';
import {
  BreadcrumbDropdownItem,
  BreadcrumbItem,
  Container,
  Tag,
  Typography,
  Tooltip,
  useOverflow,
} from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { useEffect, useMemo } from 'react';

import { CoinIcon } from '~/components';
import { routes } from '~/constants';
import {
  CoinAllocationRow,
  useAssetDropdown,
  useNavigateTo,
  useQuery,
  useWalletDropdown,
} from '~/hooks';
import {
  selectLanguage,
  selectUnHiddenAccounts,
  selectWallets,
  useAppSelector,
} from '~/store';

interface AccountNameDisplayProps {
  name: string;
  maxWidth?: string;
}

const AccountNameDisplay: React.FC<AccountNameDisplayProps> = ({
  name,
  maxWidth,
}) => {
  const { ref, isOverflowing } = useOverflow({ ofChild: true });

  return (
    <Tooltip text={name} isActive={isOverflowing}>
      <div ref={ref}>
        <Typography
          ml={1}
          $textOverflow="ellipsis"
          $whiteSpace="nowrap"
          $maxWidth={maxWidth}
        >
          {name}
        </Typography>
      </div>
    </Tooltip>
  );
};

AccountNameDisplay.defaultProps = {
  maxWidth: undefined,
};

interface AssetNameDisplayProps {
  name: string;
  maxWidth?: string;
}

const AssetNameDisplay: React.FC<AssetNameDisplayProps> = ({
  name,
  maxWidth,
}) => {
  const { ref, isOverflowing } = useOverflow({ ofChild: true });

  return (
    <Tooltip text={name} isActive={isOverflowing}>
      <div ref={ref}>
        <Typography
          ml={1}
          $textOverflow="ellipsis"
          $whiteSpace="nowrap"
          $maxWidth={maxWidth}
        >
          {name}
        </Typography>
      </div>
    </Tooltip>
  );
};

AssetNameDisplay.defaultProps = {
  maxWidth: undefined,
};

interface DropdownAccountNameDisplayProps {
  name: string;
  maxWidth?: string;
}

const DropdownAccountNameDisplay: React.FC<DropdownAccountNameDisplayProps> = ({
  name,
  maxWidth,
}) => {
  const { ref, isOverflowing } = useOverflow({ ofChild: true });

  return (
    <Tooltip text={name} isActive={isOverflowing}>
      <div ref={ref}>
        <Typography
          mx={1}
          color="muted"
          $textOverflow="ellipsis"
          $whiteSpace="nowrap"
          $maxWidth={maxWidth}
        >
          {name}
        </Typography>
      </div>
    </Tooltip>
  );
};

DropdownAccountNameDisplay.defaultProps = {
  maxWidth: undefined,
};

const selector = createSelector(
  [selectUnHiddenAccounts, selectWallets, selectLanguage],
  ({ accounts }, { wallets }, lang) => ({ accounts, wallets, lang }),
);

export const useAccountPage = () => {
  const query = useQuery();
  const navigateTo = useNavigateTo();
  const { accounts, wallets, lang } = useAppSelector(selector);
  const { selectedWallet } = useWalletDropdown({ withSelectAll: true });

  const accountId = useMemo(() => query.get('accountId') ?? undefined, [query]);

  const selectedAccount = useMemo<
    | (IAccount & {
        asset?: ICoinInfo;
        parentAccount?: IAccount;
        wallet?: IWallet;
      })
    | undefined
  >(() => {
    const id = query.get('accountId');

    const account = accounts.find(a => a.__id === id);

    if (account) {
      const wallet = wallets.find(a => a.__id === account.walletId);

      const result: IAccount & {
        asset?: ICoinInfo;
        parentAccount?: IAccount;
        wallet?: IWallet;
      } = { ...account, wallet };

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

  const assetDropdown = useAssetDropdown();

  const getAccountDropdownList = (params: {
    fromWallet: { __id?: string } | undefined;
    fromAsset: { parentAssetId: string } | undefined;
    parentAccountId?: string;
  }): BreadcrumbDropdownItem[] =>
    accounts
      .filter(
        a =>
          (params.parentAccountId || a.type === 'account') &&
          (!params.fromWallet || params.fromWallet.__id === a.walletId) &&
          (!params.fromAsset ||
            params.fromAsset.parentAssetId === a.parentAssetId) &&
          (!params.parentAccountId ||
            params.parentAccountId === a.parentAccountId),
      )
      .map(a => ({
        id: a.__id ?? '',
        displayNode: (
          <Container direction="row">
            <CoinIcon
              size="16px"
              subIconSize="8px"
              subContainerSize="12px"
              parentAssetId={a.parentAssetId}
              assetId={a.assetId}
            />
            <DropdownAccountNameDisplay
              name={a.name}
              maxWidth={a.derivationScheme !== undefined ? '6vw' : '10vw'}
            />
            {a.derivationScheme && (
              <Tag>{lodash.upperCase(a.derivationScheme)}</Tag>
            )}
          </Container>
        ),
        checkType: 'radio',
      }));

  const onAccountChange = (id: string) => {
    const params = new URLSearchParams(query.toString());
    params.set('accountId', id);
    navigateTo(`${routes.account.path}?${params}`);
  };

  const onAssetClick = (row: CoinAllocationRow) => {
    onAccountChange(row.accountId ?? '');
  };

  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const parentAccount = selectedAccount?.parentAccount ?? selectedAccount;

    const accountItem = {
      id: 'account',
      dropdown: {
        displayNode: (
          <Container direction="row">
            <CoinIcon
              parentAssetId={parentAccount?.parentAssetId ?? ''}
              assetId={parentAccount?.assetId}
              withParentIconAtBottom
              subIconSize="8px"
              subContainerSize="12px"
              size="16px"
            />
            <AccountNameDisplay name={parentAccount?.name ?? ''} />
          </Container>
        ),
        selectedItem: parentAccount?.__id ?? '',
        setSelectedItem: onAccountChange,
        dropdown: getAccountDropdownList({ fromWallet, fromAsset }),
      },
    };

    const items: BreadcrumbItem[] = [accountItem];

    if (selectedAccount?.parentAccount) {
      items.push({
        id: 'subAccount',
        dropdown: {
          displayNode: (
            <Container direction="row">
              <CoinIcon
                parentAssetId={selectedAccount.parentAssetId}
                assetId={selectedAccount.assetId}
                withParentIconAtBottom
                subIconSize="8px"
                subContainerSize="12px"
                size="16px"
              />
              <AccountNameDisplay name={selectedAccount.name} />
            </Container>
          ),
          selectedItem: selectedAccount.__id ?? '',
          setSelectedItem: onAccountChange,
          dropdown: getAccountDropdownList({
            fromWallet,
            fromAsset,
            parentAccountId: selectedAccount.parentAccount.__id,
          }),
        },
      });
    }

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
                  subIconSize="8px"
                  subContainerSize="12px"
                  size="16px"
                />
                <AssetNameDisplay name={fromAsset.asset.name} />
              </Container>
            ),
            selectedItem: `${fromAsset.parentAssetId}/${fromAsset.assetId}`,
            setSelectedItem: assetDropdown.onAssetChange,
            dropdown: assetDropdown.assetDropdownList,
          },
        },
        ...items,
      ];
    }

    if (fromWallet) {
      return [
        {
          id: 'wallet',
          text: lang.strings.wallet.title,
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
        ...items,
      ];
    }

    return items;
  }, [assetDropdown, selectedAccount, wallets, fromAsset, fromWallet]);

  useEffect(() => {
    if (!selectedAccount) {
      if (fromWallet) {
        navigateTo(`${routes.wallet.path}?id=${fromWallet.__id}`);
      } else {
        navigateTo(routes.portfolio.path);
      }
    }
  }, [selectedAccount]);

  return {
    ...assetDropdown,
    breadcrumbItems,
    accountId,
    selectedAccount,
    onAccountChange,
    onAssetClick,
    selectedWallet,
  };
};
