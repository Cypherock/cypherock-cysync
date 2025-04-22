const {
  formatDisplayAmount,
  getDefaultUnit,
  getParsedAmount,
} = require('@cypherock/coin-support-utils');
import { IAccount } from '@cypherock/db-interfaces';
import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/store';
import { selectUnHiddenAccounts } from '@/store/accounts';
import { IInteractiveItemListItem } from '@/components/ui';
import { CoinIcon } from '@/components/core';

export interface UseAccountListProps {
  selectedWalletId: string | undefined;
  includeSubAccounts?: boolean;
  assetFilter?: string[];
  defaultAccountId?: string;
  prependAccountNameToSubaccounts?: boolean;
}

export const useAccountList = (props: UseAccountListProps) => {
  const { accounts } = useAppSelector(selectUnHiddenAccounts);
  const [selectedAccount, setSelectedAccount] = useState<
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
    return `${formatDisplayAmount(amount, 5).fixed} ${unit.abbr}`;
  };

  const handleAccountChange = (id?: string) => {
    if (!id) {
      setSelectedAccount(undefined);
      return;
    }
    const account = accounts.find(a => a.__id === id);
    setSelectedAccount(account);
  };

  useEffect(() => {
    if (props.defaultAccountId) {
      const account = accounts.find(a => a.__id === props.defaultAccountId);
      setSelectedAccount(account);
    }
  }, [props.defaultAccountId, accounts]);

  const accountList = useMemo(() => {
    const accountsList: IInteractiveItemListItem[] = [];

    const mainAccounts = accounts.filter(
      account =>
        account.walletId === props.selectedWalletId &&
        account.type === 'account' &&
        (props.assetFilter
          ? props.assetFilter.includes(account.assetId)
          : true),
    );

    for (const account of mainAccounts) {
      accountsList.push({
        id: account.__id || '',
        leftIcon: (
          <CoinIcon
            parentAssetId={account.parentAssetId}
            assetId={account.assetId}
          />
        ),
        text: account.name,
        tag: account.derivationScheme?.toUpperCase(),
        rightText: getBalanceToDisplay(account),
      });

      if (props.includeSubAccounts) {
        const subAccounts = accounts.filter(
          subAccount => subAccount.parentAccountId === account.__id,
        );
        accountsList.push(
          ...subAccounts.map(subAccount => ({
            id: subAccount.__id || '',
            leftIcon: (
              <CoinIcon
                parentAssetId={subAccount.parentAssetId}
                assetId={subAccount.assetId}
                size={12}
              />
            ),
            text:
              (props.prependAccountNameToSubaccounts
                ? `${account.name} - `
                : '') + subAccount.name,
            rightText: getBalanceToDisplay(subAccount),
            showRightTextOnBottom: true,
            $parentId: account.__id,
          })),
        );
      }
    }

    return accountsList;
  }, [
    accounts,
    props.selectedWalletId,
    props.includeSubAccounts,
    props.assetFilter,
  ]);

  return {
    selectedAccount,
    setSelectedAccount,
    handleAccountChange,
    accountList,
  };
};
