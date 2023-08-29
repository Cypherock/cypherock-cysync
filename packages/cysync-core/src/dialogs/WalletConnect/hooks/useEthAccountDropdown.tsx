import { getParsedAmount } from '@cypherock/coin-support-utils';
import { EvmId, EvmIdMap, coinList } from '@cypherock/coins';
import { DropDownListItemProps } from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, { useMemo, useState } from 'react';
import { CoinIcon } from '~/components';
import { useWalletDropdown } from '~/hooks';
import { selectAccounts, useAppSelector } from '~/store';

function groupEvmAccounts<T>(evmAccounts: (T & { assetId: string })[]): {
  assetId: EvmId;
  accounts: T[];
}[] {
  const evmAccountsGrouped: {
    assetId: EvmId;
    accounts: T[];
  }[] = [];

  evmAccounts.forEach(account => {
    if (!Object.keys(EvmIdMap).includes(account.assetId)) {
      throw new Error(`Account Asset not Supported: ${account.assetId}`);
    }
    const matchedGroup = evmAccountsGrouped.find(
      a => a.assetId === account.assetId,
    );
    if (matchedGroup === undefined) {
      evmAccountsGrouped.push({
        assetId: account.assetId as EvmId,
        accounts: [account],
      });
    } else {
      matchedGroup.accounts.push(account);
    }
  });
  return evmAccountsGrouped;
}

export const useEthAccountDropdown = () => {
  const {
    selectedWallet,
    setSelectedWallet,
    walletDropdownList,
    handleWalletChange,
  } = useWalletDropdown();

  const { accounts } = useAppSelector(selectAccounts);
  const evmAccounts = accounts.filter(
    (account: IAccount) => account.familyId === 'evm',
  );

  const [selectedEvmAccounts, setSelectedEvmAccounts] = useState<IAccount[]>(
    [],
  );

  const getBalanceToDisplay = (account: IAccount) => {
    const { amount, unit } = getParsedAmount({
      coinId: account.assetId,
      unitAbbr: account.unit,
      amount: account.balance,
    });
    return `${amount} ${unit.abbr}`;
  };

  const handleSelectAccount = (id: string) => {
    // Return if account is already selected
    if (selectedEvmAccounts.find(a => a.__id === id)) return;

    const accountToAdd = evmAccounts.find(a => a.__id === id);
    if (accountToAdd === undefined) {
      throw new Error(`Account Not Found! Id = ${id}`);
    }

    setSelectedEvmAccounts([...selectedEvmAccounts, accountToAdd]);
  };

  const handleDisselectAccount = (id: string) => {
    const filteredEvmAccounts = selectedEvmAccounts.filter(a => a.__id !== id);
    setSelectedEvmAccounts(filteredEvmAccounts);
  };

  const evmAccountDropdownListGroup: {
    assetId: EvmId;
    accounts: DropDownListItemProps[];
  }[] = useMemo(() => {
    const filteredEvmAccountsDropdownList = evmAccounts
      .filter(account => account.walletId === selectedWallet?.__id)
      .map(account => ({
        id: account.__id,
        checkType: 'radio' as DropDownListItemProps['checkType'],
        leftImage: <CoinIcon assetId={account.assetId} />,
        text: account.name,
        shortForm: `(${coinList[account.assetId].abbr})`,
        tag: lodash.upperCase(account.derivationScheme),
        rightText: getBalanceToDisplay(account),
        assetId: account.assetId,
      }));
    return groupEvmAccounts<DropDownListItemProps>(
      filteredEvmAccountsDropdownList,
    );
  }, [evmAccounts, selectedWallet]);

  const selectedEvmAccountsGroup =
    groupEvmAccounts<IAccount>(selectedEvmAccounts);
  const evmAccountsGroup = groupEvmAccounts<IAccount>(evmAccounts);

  return {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
    selectedEvmAccounts,
    selectedEvmAccountsGroup,
    evmAccountsGroup,
    setSelectedEvmAccounts,
    getBalanceToDisplay,
    handleSelectAccount,
    handleDisselectAccount,
    evmAccountDropdownListGroup,
  };
};
