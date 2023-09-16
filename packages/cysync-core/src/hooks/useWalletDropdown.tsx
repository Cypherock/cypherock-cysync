import {
  DropDownListItemProps,
  WalletIcon,
  useTheme,
} from '@cypherock/cysync-ui';
import { IWallet } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { selectLanguage, selectWallets, useAppSelector } from '..';

export interface UseWalletDropdownProps {
  walletId?: string;
  withSelectAll?: boolean;
}

const selector = createSelector(
  [selectLanguage, selectWallets],
  (lang, { wallets }) => ({ lang, wallets }),
);

export const useWalletDropdown = (props?: UseWalletDropdownProps) => {
  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();
  const { wallets, lang } = useAppSelector(selector);
  const theme = useTheme();

  const handleWalletChange = useCallback(
    (id?: string) => {
      if (!id) setSelectedWallet(undefined);
      setSelectedWallet(wallets.find(w => w.__id === id));
    },
    [wallets],
  );

  const walletDropdownList: DropDownListItemProps[] = useMemo(() => {
    const list: DropDownListItemProps[] = wallets.map(w => ({
      id: w.__id ?? '',
      text: w.name,
      checkType: 'radio',
      leftImage: (
        <WalletIcon fill={theme.palette.text.white} width={20} height={20} />
      ),
    })) as any;

    if (props?.withSelectAll) {
      list.unshift({
        id: 'all',
        text: lang.strings.allWallets,
        checkType: 'radio',
        leftImage: (
          <WalletIcon fill={theme.palette.text.white} width={20} height={20} />
        ),
      });
    }

    return list;
  }, [wallets]);

  useEffect(() => {
    if (props?.walletId) {
      const wallet = wallets.find(w => w.__id === props.walletId);

      setSelectedWallet(wallet);
    }
  }, [props?.walletId]);

  return {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
  };
};
