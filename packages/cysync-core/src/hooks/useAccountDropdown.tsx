import { getParsedAmount } from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import { DropDownListItemProps } from '@cypherock/cysync-ui';
import { AccountTypeMap, IAccount } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, { useMemo, useState } from 'react';

import { useWalletDropdown } from './useWalletDropdown';

import { CoinIcon, selectAccounts, useAppSelector } from '..';

export const useAccountDropdown = () => {
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
      coinId: account.assetId,
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

  const accountDropdownList: DropDownListItemProps[] = useMemo(
    () =>
      accounts
        .filter(
          account =>
            account.walletId === selectedWallet?.__id &&
            account.type === AccountTypeMap.account,
        )
        .map(account => ({
          id: account.__id,
          checkType: 'radio',
          leftImage: <CoinIcon parentAssetId={account.parentAssetId} />,
          text: account.name,
          shortForm: `(${coinList[account.assetId].abbr})`,
          tag: lodash.upperCase(account.derivationScheme),
          rightText: getBalanceToDisplay(account),
        })),
    [accounts, selectedWallet],
  );

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
