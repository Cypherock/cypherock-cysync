import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import { AccountTypeMap, IAccount, IWallet } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

import { CoinIcon, selectUnHiddenAccounts, useAppSelector } from '..';

export interface UseAccountDropdownProps {
  selectedWallet: IWallet | undefined;
  includeSubAccounts?: boolean;
  assetFilter?: string[];
  defaultAccountId?: string;
}

export const useAccountDropdown = (props: UseAccountDropdownProps) => {
  const { accounts } = useAppSelector(selectUnHiddenAccounts);
  const [selectedAccount, setSelectedAccount] = useState<
    IAccount | undefined
  >();
  const [selectedAccountParent, setSelectedAccountParent] = useState<
    IAccount | undefined
  >();

  const getBalanceToDisplay = (account: IAccount) => {
    const { amount, unit } = getParsedAmount({
      coinId: account.parentAssetId,
      assetId: account.assetId,
      unitAbbr:
        account.unit ??
        getDefaultUnit(account.parentAssetId, account.assetId).abbr,
      amount: account.balance,
    });
    return `${amount} ${unit.abbr}`;
  };

  const handleAccountChange = (id?: string) => {
    if (!id) {
      setSelectedAccount(undefined);
      setSelectedAccountParent(undefined);
      return;
    }
    const account = accounts.find(a => a.__id === id);
    setSelectedAccount(account);
    setSelectedAccountParent(
      accounts.find(a => a.__id === account?.parentAccountId),
    );
  };

  useEffect(() => {
    if (props.defaultAccountId) {
      const account = accounts.find(a => a.__id === props.defaultAccountId);

      setSelectedAccount(account);
      setSelectedAccountParent(
        accounts.find(a => a.__id === account?.parentAccountId),
      );
    }
  }, []);

  const accountDropdownList: DropDownItemProps[] = useMemo(() => {
    const accountsList: DropDownItemProps[] = [];

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
        tag: lodash.upperCase(account.derivationScheme),
        rightText: getBalanceToDisplay(account),
        showRightTextOnBottom: true,
      });

      if (props.includeSubAccounts) {
        const subAccounts = accounts.filter(
          subAccount => subAccount.parentAccountId === account.__id,
        );
        accountsList.push(
          ...subAccounts.map(subAccount => ({
            id: subAccount.__id,
            checkType: 'radio' as any,
            leftImage: (
              <CoinIcon
                parentAssetId={subAccount.parentAssetId}
                assetId={subAccount.assetId}
              />
            ),
            text: subAccount.name,
            rightText: getBalanceToDisplay(subAccount),
            showRightTextOnBottom: true,
            $parentId: account.__id,
          })),
        );
      }
    }

    return accountsList;
  }, [accounts, props.selectedWallet, props.includeSubAccounts]);

  return {
    selectedAccount,
    setSelectedAccount,
    selectedAccountParent,
    handleAccountChange,
    accountDropdownList,
  };
};
