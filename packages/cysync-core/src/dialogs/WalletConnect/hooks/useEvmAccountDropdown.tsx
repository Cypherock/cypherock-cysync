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

  const group = lodash.groupBy(evmAccounts, a => a.assetId);

  for (const assetId in group) {
    if (Object.keys(EvmIdMap).includes(assetId)) {
      evmAccountsGrouped.push({
        assetId: assetId as EvmId,
        accounts: group[assetId],
      });
    }
  }

  return evmAccountsGrouped;
}

export const useEvmAccountDropdown = () => {
  const { selectedWallet, walletDropdownList, handleWalletChange } =
    useWalletDropdown();

  const { accounts } = useAppSelector(selectAccounts);
  const evmAccounts = useMemo(
    () => accounts.filter((account: IAccount) => account.familyId === 'evm'),
    [accounts],
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

  const handleDeselectAccount = (id: string) => {
    const filteredEvmAccounts = selectedEvmAccounts.filter(a => a.__id !== id);
    setSelectedEvmAccounts(filteredEvmAccounts);
  };

  const onChange = (id: string | undefined, assetId: string) => {
    const filteredSelectedAccounts = selectedEvmAccounts.filter(
      a => a.assetId !== assetId,
    );

    if (id === undefined) {
      setSelectedEvmAccounts(filteredSelectedAccounts);
      return;
    }

    const accountToAdd = evmAccounts.find(
      a => a.assetId === assetId && a.__id === id,
    );

    if (accountToAdd === undefined) {
      throw new Error(`unexpected account id (${id}) or assetId (${assetId})`);
    }

    setSelectedEvmAccounts([...filteredSelectedAccounts, accountToAdd]);
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
        leftImage: <CoinIcon parentAssetId={account.parentAssetId} />,
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

  const selectedEvmAccountsGroup = useMemo(
    () => groupEvmAccounts<IAccount>(selectedEvmAccounts),
    [selectedEvmAccounts],
  );
  const evmAccountsGroup = useMemo(
    () => groupEvmAccounts<IAccount>(evmAccounts),
    [evmAccounts],
  );

  return {
    selectedWallet,
    handleWalletChange,
    walletDropdownList,
    selectedEvmAccounts,
    selectedEvmAccountsGroup,
    evmAccountsGroup,
    onChange,
    getBalanceToDisplay,
    handleSelectAccount,
    handleDeselectAccount,
    evmAccountDropdownListGroup,
  };
};
