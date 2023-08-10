import { getParsedAmount } from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import { DropDownListItemProps } from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
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
      unitName: account.unit,
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
        .filter(account => account.walletId === selectedWallet?.__id)
        .map(account => ({
          id: account.__id,
          checkType: 'radio',
          leftImage: <CoinIcon assetId={account.assetId} />,
          text: account.name,
          shortForm: `(${coinList[account.assetId].abbr})`,
          tag: account.derivationScheme?.toUpperCase(),
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
