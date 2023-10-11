import { evmCoinList } from '@cypherock/coins';
import { Dropdown, parseLangTemplate } from '@cypherock/cysync-ui';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
import React, { useEffect } from 'react';

import { useAccountDropdown } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

const getAssetFromChain = (chainId: number) =>
  Object.values(evmCoinList).find(coin => coin.chain === chainId);

export const ChainSpecificAccountSelection: React.FC<{
  chain: string;
  selectedWallet: IWallet | undefined;
  updateChainToAccountMap: (account: IAccount, chain: string) => void;
  asterisk?: boolean;
}> = ({ selectedWallet, chain, updateChainToAccountMap, asterisk }) => {
  const lang = useAppSelector(selectLanguage);
  const { accountSelectionTab } = lang.strings.walletConnect;
  const chainId = parseInt(chain.split(':')[1], 10);
  const asset = getAssetFromChain(chainId);
  if (!asset) return null;

  const { selectedAccount, handleAccountChange, accountDropdownList } =
    useAccountDropdown({
      selectedWallet,
      assetFilter: [asset.id],
    });

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
      onChange={handleAccountChange}
    />
  );
};

ChainSpecificAccountSelection.defaultProps = {
  asterisk: undefined,
};
