import { evmCoinList } from '@cypherock/coins';
import { Dropdown, parseLangTemplate } from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import React, { useCallback, useEffect } from 'react';

import { useAccountDropdown } from '~/hooks';
import {
  selectAccounts,
  selectLanguage,
  useShallowEqualAppSelector,
} from '~/store';
import logger from '~/utils/logger';

const getAssetFromChain = (chainId: number) =>
  Object.values(evmCoinList).find(coin => coin.chain === chainId);

const selector = createSelector(
  [selectAccounts, selectLanguage],
  ({ accounts }, lang) => ({
    accounts,
    lang,
  }),
);

export const ChainSpecificAccountSelection: React.FC<{
  chain: string;
  selectedWallet: IWallet | undefined;
  updateChainToAccountMap: (account: IAccount, chain: string) => void;
  asterisk?: boolean;
}> = ({ selectedWallet, chain, updateChainToAccountMap, asterisk }) => {
  const { accounts: allAccounts, lang } = useShallowEqualAppSelector(selector);
  const { accountSelectionTab } = lang.strings.walletConnect;
  const chainId = parseInt(chain.split(':')[1], 10);
  const asset = getAssetFromChain(chainId);
  if (!asset) return null;

  const { selectedAccount, handleAccountChange, accountDropdownList } =
    useAccountDropdown({
      selectedWallet,
      assetFilter: [asset.id],
    });

  const handleAccountChangeProxy: typeof handleAccountChange = useCallback(
    (id: string | undefined, ...args) => {
      const targetAccount = allAccounts.find(a => a.__id === id);
      logger.info('Dropdown Change: Account Change', {
        source: `WalletConnect/${ChainSpecificAccountSelection.name}`,
        assetId: targetAccount?.assetId,
        derivationPath: targetAccount?.derivationPath,
      });
      return handleAccountChange(id, ...args);
    },
    [allAccounts, handleAccountChange],
  );

  useEffect(() => {
    if (selectedAccount) updateChainToAccountMap(selectedAccount, chain);
  }, [selectedAccount]);

  return (
    <Dropdown
      key={chain}
      items={accountDropdownList}
      selectedItem={selectedAccount?.__id}
      disabled={!selectedWallet}
      searchText={
        parseLangTemplate(accountSelectionTab.chooseAccount, {
          assetName: asset.name,
        }) + (asterisk ? '*' : '')
      }
      placeholderText={
        parseLangTemplate(accountSelectionTab.chooseAccount, {
          assetName: asset.name,
        }) + (asterisk ? '*' : '')
      }
      onChange={handleAccountChangeProxy}
    />
  );
};

ChainSpecificAccountSelection.defaultProps = {
  asterisk: undefined,
};
