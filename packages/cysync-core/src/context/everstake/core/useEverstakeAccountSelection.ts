import { getDefaultUnit, getParsedAmount } from '@cypherock/coin-support-utils';
import { DropDownItemProps } from '@cypherock/cysync-ui';
import { IAccount } from '@cypherock/db-interfaces';
import React, { useEffect, useMemo, useState } from 'react';

import { CoinIcon } from '~/components';
import { EVERSTAKE_ASSETS, IEverstakeAsset } from '~/constants/everstake';
import { useAccounts, useWalletDropdown } from '~/hooks';

export const useEverstakeAccountSelection = (params: {
  initialWalletId?: string;
  initialAccountId?: string;
}) => {
  const { initialWalletId, initialAccountId } = params;

  const { selectedWallet, handleWalletChange, walletDropdownList } =
    useWalletDropdown(
      initialWalletId ? { walletId: initialWalletId } : undefined,
    );

  const allAccounts = useAccounts();

  const stakeableAccounts = useMemo(
    () =>
      allAccounts.filter(acc =>
        EVERSTAKE_ASSETS.some(
          cfg =>
            cfg.assetId === acc.assetId &&
            cfg.parentAssetId === acc.parentAssetId,
        ),
      ),
    [allAccounts],
  );

  const walletAccounts = useMemo(
    () =>
      stakeableAccounts.filter(acc =>
        selectedWallet ? acc.walletId === selectedWallet.__id : true,
      ),
    [stakeableAccounts, selectedWallet],
  );

  const [selectedAccountId, setSelectedAccountId] = useState<
    string | undefined
  >(initialAccountId);

  useEffect(() => {
    if (
      (!selectedAccountId ||
        !walletAccounts.some(a => a.__id === selectedAccountId)) &&
      walletAccounts.length > 0
    ) {
      setSelectedAccountId(walletAccounts[0].__id);
    }
  }, [walletAccounts, selectedAccountId]);

  const handleAccountChange = (id?: string) => setSelectedAccountId(id);

  const selectedAccount = useMemo(
    () => walletAccounts.find(a => a.__id === selectedAccountId),
    [walletAccounts, selectedAccountId],
  );

  const assetConfig = useMemo(
    () =>
      EVERSTAKE_ASSETS.find(
        cfg =>
          selectedAccount &&
          cfg.assetId === selectedAccount.assetId &&
          cfg.parentAssetId === selectedAccount.parentAssetId,
      ),
    [selectedAccount],
  );
  const isPol = assetConfig?.kind === 'pol';

  const unitAbbr = useMemo(() => {
    if (!selectedAccount) return isPol ? 'POL' : 'ETH';
    try {
      return getDefaultUnit(
        selectedAccount.parentAssetId,
        selectedAccount.assetId,
      ).abbr;
    } catch {
      return isPol ? 'POL' : 'ETH';
    }
  }, [selectedAccount, isPol]);

  const getBalanceDisplay = (acc: IAccount): string => {
    try {
      const { amount: bal, unit } = getParsedAmount({
        coinId: acc.parentAssetId,
        assetId: acc.assetId,
        unitAbbr: getDefaultUnit(acc.parentAssetId, acc.assetId).abbr,
        amount: acc.balance,
      });
      return `${bal} ${unit.abbr}`;
    } catch {
      return acc.balance;
    }
  };

  const accountDropdownList: DropDownItemProps[] = useMemo(
    () =>
      walletAccounts.map(acc => ({
        id: acc.__id,
        checkType: 'radio',
        leftImage: React.createElement(CoinIcon, {
          parentAssetId: acc.parentAssetId,
          assetId: acc.assetId,
        }),
        text: acc.name,
        rightText: getBalanceDisplay(acc),
        showRightTextOnBottom: true,
      })),
    [walletAccounts],
  );

  return {
    selectedWallet,
    handleWalletChange,
    walletDropdownList,
    selectedAccount,
    handleAccountChange,
    accountDropdownList,
    assetConfig: assetConfig as IEverstakeAsset | undefined,
    isPol,
    unitAbbr,
  };
};
