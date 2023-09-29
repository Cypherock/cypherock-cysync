import { getAsset, getParsedAmount } from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import { DropDownListItemProps } from '@cypherock/cysync-ui';
import { AccountTypeMap, IAccount, IWallet } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, { useMemo, useState } from 'react';

import { CoinIcon, selectAccounts, useAppSelector } from '..';

export interface UseAccountDropdownProps {
  selectedWallet: IWallet | undefined;
  includeSubAccounts?: boolean;
  assetFilter?: string[];
}

export const useAccountDropdown = (props: UseAccountDropdownProps) => {
  const { accounts } = useAppSelector(selectAccounts);
  const [selectedAccount, setSelectedAccount] = useState<
    IAccount | undefined
  >();

  const getBalanceToDisplay = (account: IAccount) => {
    const { amount, unit } = getParsedAmount({
      coinId: account.parentAssetId,
      assetId: account.assetId,
      unitAbbr: account.unit,
      amount: account.balance,
    });
    return `${amount} ${unit.abbr}`;
  };

  const handleAccountChange = (id?: string) => {
    if (!id) {
      setSelectedAccount(undefined);
      return;
    }
    setSelectedAccount(accounts.find(a => a.__id === id));
  };

  const accountDropdownList: DropDownListItemProps[] = useMemo(() => {
    const accountsList: DropDownListItemProps[] = [];

    const mainAccounts = accounts.filter(
      account =>
        account.walletId === props.selectedWallet?.__id &&
        account.type === AccountTypeMap.account &&
        (props.assetFilter
          ? props.assetFilter.includes(account.assetId)
          : true),
    );

    for (const account of mainAccounts) {
      accountsList.push({
        id: account.__id,
        checkType: 'radio',
        leftImage: (
          <CoinIcon
            parentAssetId={account.parentAssetId}
            assetId={account.assetId}
          />
        ),
        text: account.name,
        shortForm: `(${coinList[account.assetId].abbr})`,
        tag: lodash.upperCase(account.derivationScheme),
        rightText: getBalanceToDisplay(account),
      });

      if (props.includeSubAccounts) {
        const subAccounts = accounts.filter(
          subAccount => subAccount.parentAccountId === account.__id,
        );
        accountsList.push(
          ...subAccounts.map(subAccount => {
            const asset = getAsset(
              subAccount.parentAssetId,
              subAccount.assetId,
            );

            return {
              id: subAccount.__id,
              checkType: 'radio' as any,
              leftImage: (
                <CoinIcon
                  parentAssetId={subAccount.parentAssetId}
                  assetId={subAccount.assetId}
                />
              ),
              text: subAccount.name,
              shortForm: `(${asset.abbr})`,
              rightText: getBalanceToDisplay(account),
              $parentId: account.__id,
            };
          }),
        );
      }
    }

    return accountsList;
  }, [accounts, props.selectedWallet, props.includeSubAccounts]);

  return {
    selectedAccount,
    setSelectedAccount,
    handleAccountChange,
    accountDropdownList,
  };
};
