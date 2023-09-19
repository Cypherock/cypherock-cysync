import { getAsset, getParsedAmount } from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import { DropDownListItemProps } from '@cypherock/cysync-ui';
import { AccountTypeMap, IAccount } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, { useMemo, useState } from 'react';

import { useWalletDropdown } from './useWalletDropdown';

import { CoinIcon, selectAccounts, useAppSelector } from '..';

export interface UseAccountDropdownProps {
  includeSubAccounts?: boolean;
}

export const useAccountDropdown = (props?: UseAccountDropdownProps) => {
  const {
    selectedWallet,
    setSelectedWallet,
    walletDropdownList,
    handleWalletChange,
  } = useWalletDropdown();
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
        account.walletId === selectedWallet?.__id &&
        account.type === AccountTypeMap.account,
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

      if (props?.includeSubAccounts) {
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
  }, [accounts, selectedWallet, props?.includeSubAccounts]);

  return {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
    selectedAccount,
    setSelectedAccount,
    handleAccountChange,
    accountDropdownList,
  };
};
