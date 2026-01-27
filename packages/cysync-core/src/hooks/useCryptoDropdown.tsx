import { coinList, IEvmCoinInfo } from '@cypherock/coins';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import React, { useMemo, useState } from 'react';

import { CoinIcon } from '../components';

export interface UseCryptoDropdownProps {
  defaultCryptoId?: string;
}

export interface SelectedCrypto {
  __id: string;
  parentAssetId: string;
  assetId: string;
  name: string;
  abbr: string;
  network: string;
}

export const useCryptoDropdown = ({
  defaultCryptoId,
}: UseCryptoDropdownProps = {}) => {
  const [selectedCrypto, setSelectedCrypto] = useState<
    SelectedCrypto | undefined
  >();

  const handleCryptoChange = (id?: string) => {
    if (!id) {
      setSelectedCrypto(undefined);
      return;
    }

    const [parentAssetId, assetId] = id.split('/');
    const coin = coinList[parentAssetId];

    if (!coin) {
      setSelectedCrypto(undefined);
      return;
    }

    let name: string;
    let abbr: string;

    if (parentAssetId === assetId) {
      // Main coin
      name = coin.name;
      abbr = coin.abbr;
    } else {
      // Token
      const token = (coin as IEvmCoinInfo).tokens?.[assetId];
      if (!token) {
        setSelectedCrypto(undefined);
        return;
      }
      name = token.name;
      abbr = token.abbr;
    }

    setSelectedCrypto({
      __id: id,
      parentAssetId,
      assetId,
      name,
      abbr,
      network: coin.name,
    });
  };

  const cryptoDropdownList = useMemo(() => {
    const dropdownItems: DropDownItemProps[] = [];

    Object.entries(coinList).forEach(([parentAssetId, coin]) => {
      dropdownItems.push({
        id: `${parentAssetId}/${parentAssetId}`,
        checkType: 'radio',
        text: coin.name,
        shortForm: `(${coin.abbr})`,
        leftImage: (
          <CoinIcon parentAssetId={parentAssetId} assetId={parentAssetId} />
        ),
        rightText: parentAssetId
          ? parentAssetId[0].toUpperCase() +
            parentAssetId.slice(1).toLowerCase()
          : '',
      });

      // Add tokens if it's an EVM coin with tokens
      if ((coin as IEvmCoinInfo).tokens) {
        const evmCoin = coin as IEvmCoinInfo;
        Object.entries(evmCoin.tokens).forEach(([tokenAssetId, token]) => {
          dropdownItems.push({
            id: `${parentAssetId}/${tokenAssetId}`,
            checkType: 'radio' as const,
            leftImage: (
              <CoinIcon parentAssetId={parentAssetId} assetId={tokenAssetId} />
            ),
            text: token.name,
            shortForm: `(${token.abbr})`,
            rightText: parentAssetId
              ? parentAssetId[0].toUpperCase() +
                parentAssetId.slice(1).toLowerCase()
              : '',
          });
        });
      }
    });

    return dropdownItems;
  }, [coinList]);

  // Set default selection if provided
  React.useEffect(() => {
    if (defaultCryptoId && !selectedCrypto) {
      const [parentAssetId, assetId] = defaultCryptoId.split('/');
      const coin = coinList[parentAssetId];

      if (!coin) return;

      let name: string;
      let abbr: string;

      if (parentAssetId === assetId) {
        // Main coin
        name = coin.name;
        abbr = coin.abbr;
      } else {
        // Token
        const token = (coin as IEvmCoinInfo).tokens?.[assetId];
        if (!token) return;
        name = token.name;
        abbr = token.abbr;
      }

      setSelectedCrypto({
        __id: defaultCryptoId,
        parentAssetId,
        assetId,
        name,
        abbr,
        network: coin.name,
      });
    }
  }, [defaultCryptoId, selectedCrypto]);

  return {
    selectedCrypto,
    setSelectedCrypto,
    handleCryptoChange,
    cryptoDropdownList,
  };
};
